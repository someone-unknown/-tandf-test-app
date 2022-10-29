import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  parse,
} from 'date-fns';

@Service()
export class AppointmentService {

  public constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  public async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  public async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    const doctor: Doctor = await this.doctorRepo.findOneOrFail({ where: { id: options.slot.doctorId } });
    const interval: { start: Date, end: Date } = { start: new Date(options.slot.start), end: new Date(options.slot.end) };

    if (!AppointmentService.checkSlot(interval)) {
      throw new Error('You can book an appointment for a single day only.');
    }

    if (!await this.isDoctorAvailable(doctor, interval)) {
      throw new Error('Doctor is not available at specified interval');
    }

    if (await this.isSlotTaken(doctor, interval)) {
      throw new Error('Appointment slot already taken');
    }

    const appointment: Appointment = this.appointmentRepo.create({
      doctor,
      startTime: options.slot.start,
      durationMinutes: differenceInMinutes(options.slot.end, options.slot.start),
      patientName: options.patientName,
      description: options.description,
    });

    await appointment.save();

    return appointment;
  }

  private static checkSlot(interval: { start: Date, end: Date }): boolean {
    return interval.start.getDay() === interval.end.getDay();
  }

  private async isDoctorAvailable(doctor: Doctor, interval: { start: Date, end: Date }): Promise<boolean> {
    const availability: Availability[] = await doctor.availability;

    const matchedAvailabilities: Availability[] = availability.filter((availability: Availability): boolean => {
      const availabilityStart: Date = parse(availability.startTimeUtc, 'HH:mm', interval.start);
      const availabilityEnd: Date = parse(availability.endTimeUtc, 'HH:mm', interval.start);

      return areIntervalsOverlapping(interval, { start: availabilityStart, end: availabilityEnd });
    });

    return matchedAvailabilities.length > 0;
  }

  private async isSlotTaken(doctor: Doctor, interval: { start: Date, end: Date }): Promise<boolean> {
    const appointments: Appointment[] = await doctor.appointments;

    const matchedAppointments: Appointment[] = appointments.filter((appointment: Appointment): boolean => {
      const endTime: Date = addMinutes(appointment.startTime, appointment.durationMinutes);

      return areIntervalsOverlapping(interval, { start: appointment.startTime, end: endTime });
    });

    return matchedAppointments.length > 0;
  }
}
