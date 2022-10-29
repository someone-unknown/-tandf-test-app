import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { AvailabilityInput } from "@/models/availability/AvailabilityInput";
import { DoctorInput } from "@/models/doctor/DoctorInput";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { addMinutes, areIntervalsOverlapping, differenceInMinutes, getDay, getHours, getMinutes, getDayOfYear, parse, setDayOfYear, Interval } from "date-fns";

@Service()
export class DoctorService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {}

  public async getDoctors(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  public async addOrUpdateDoctor(input: DoctorInput): Promise<Doctor> {
    const doctor: Doctor | undefined = await this.doctorRepo.findOne({ where: { id: input.id } });

    if (typeof doctor === 'undefined') {
      return await this.addDoctor(input);
    }

    return this.updateDoctor(doctor, input);
  }

  private async addDoctor(input: DoctorInput): Promise<Doctor> {
    const doctor: Doctor = this.doctorRepo.create(input);
    await doctor.save();

    if (Array.isArray(input.availability)) {
      doctor.availability = await Promise.all(input.availability.map(async (input: AvailabilityInput): Promise<Availability> => {
        const availability: Availability = this.availabilityRepo.create(input);
        availability.doctor = doctor;

        await availability.save();

        return availability;
      }));
    }

    return doctor;
  }

  private async updateDoctor(doctor: Doctor, input: DoctorInput): Promise<Doctor> {
    const availability: Availability[] = await doctor.availability;
    doctor.name = input.name;
    await doctor.save();

    if (Array.isArray(availability)) {
      await Promise.all(availability.map(async (availability: Availability): Promise<void> => {
        await availability.remove();
      }));
    }

    doctor.availability = undefined;

    if (Array.isArray(input.availability)) {
      doctor.availability = await Promise.all(input.availability.map(async (input: AvailabilityInput): Promise<Availability> => {
        const availability: Availability = this.availabilityRepo.create(input);
        availability.doctor = doctor;

        await availability.save();

        return availability;
      }));
    }

    return doctor;
  }

  public async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    const startDay: number = getDayOfYear(from);
    const endDay: number = getDayOfYear(to);
    const intervalInDays: number = endDay - startDay || 1;

    // Neither elastic search, nor temporary/view tables, nor cache :(((
    const doctors: Doctor[] = await this.doctorRepo.find();

    const data: { doctorId: number; availability: Availability[]; appointments: Appointment[]; }[] = await Promise.all(doctors.map(async (doctor: Doctor): Promise<{ doctorId: number; availability: Availability[]; appointments: Appointment[]; }> => ({
      doctorId: doctor.id,
      availability: await doctor.availability,
      appointments: await doctor.appointments,
    })));

    return Array(intervalInDays).fill(null).map((_: null, index: number): Slot[] => {
      const currentDateFrom: Date = setDayOfYear(from, startDay + index);
      const currentDateTo: Date = setDayOfYear(to, startDay + index);

      if (index !== 0) {
        currentDateFrom.setHours(0, 0, 0);
      }

      if (index !== intervalInDays - 1) {
        currentDateTo.setHours(23, 59, 59);
      }

      const currentDayOfWeek: number = getDay(currentDateFrom);

      return data.reduce((accumulator: Slot[], { doctorId, availability, appointments }: { doctorId: number; availability: Availability[]; appointments: Appointment[]; }): Slot[] => {
        return accumulator.concat(availability
          .map((availability: Availability): Interval[] => {
            if (availability.dayOfWeek === currentDayOfWeek) {
              return DoctorService.filterAvailableSlots(availability, appointments, currentDateFrom, currentDateTo);
            }

            return [];
          })
          .reduce((accumulator: Interval[], value: Interval[]): Interval[] => accumulator.concat(value), [])
          .map(DoctorService.chunkAvailabilitySlots)
          .reduce((accumulator: Interval[], value: Interval[]): Interval[] => accumulator.concat(value), [])
          .map((interval: Interval): Slot => ({
            doctorId,
            start: new Date(interval.start),
            end: new Date(interval.end),
          })));
      }, []);
    })
    .reduce((accumulator: Slot[], row: Slot[]): Slot[] => accumulator.concat(row), []);
  }

  private static filterAvailableSlots(availability: Availability, appointments: Appointment[], currentDateFrom: Date, currentDateTo: Date): Interval[] {
    const availabilityStartTime: Date = parse(availability.startTimeUtc, 'HH:mm', currentDateFrom);
    const availabilityEndTime: Date = parse(availability.endTimeUtc, 'HH:mm', currentDateFrom);

    if (areIntervalsOverlapping({ start: currentDateFrom, end: currentDateTo }, { start: availabilityStartTime, end: availabilityEndTime })) {
      const start: Date = new Date(Math.max(currentDateFrom.getTime(), availabilityStartTime.getTime()));
      const end: Date = new Date(Math.min(currentDateTo.getTime(), availabilityEndTime.getTime()));

      const matchedAppointments: Appointment[] = appointments
        .filter((appointment: Appointment): boolean => {
          const appointmentStartTime: Date = appointment.startTime;
          const appointmentEndTime: Date = addMinutes(appointmentStartTime, appointment.durationMinutes);

          return areIntervalsOverlapping({ start, end }, { start: appointmentStartTime, end: appointmentEndTime });
        })
        .sort((appointment1: Appointment, appointment2: Appointment): number => appointment1.startTime.getTime() - appointment2.startTime.getTime());

      if (Array.isArray(matchedAppointments)) {
        return matchedAppointments.reduce((accumulator: Interval[], appointment: Appointment): Interval[] => {
          const rest: Interval[] = accumulator.slice(0, -1);
          const last: Interval = accumulator.slice(-1)[0];

          return [ ...rest, { start: last.start, end: appointment.startTime }, { start: addMinutes(appointment.startTime, appointment.durationMinutes), end: last.end } ];
        }, [{ start, end }]);
      }

      return [{ start, end }];
    }

    return [{ start: availabilityStartTime, end: availabilityEndTime }];
  }

  private static chunkAvailabilitySlots(interval: Interval): Interval[] {
    // Split onto 15 mins intervals
    const chunksCount: number = Math.ceil(differenceInMinutes(interval.end, interval.start) / 15);

    return Array(chunksCount).fill(null).map((_: null, index: number): Interval => {
      const offsetStart: number = 15 * index;
      const offsetEnd: number = offsetStart + 15;

      return {
        start: addMinutes(interval.start, offsetStart),
        end: index === chunksCount - 1 ? interval.end : addMinutes(interval.start, offsetEnd),
      };
    });
  }
}

export default DoctorService;
