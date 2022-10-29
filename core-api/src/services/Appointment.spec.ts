import { Appointment } from "@/entities/Appointment";
import { Availability } from '@/entities/Availability';
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { faker } from "@faker-js/faker";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, addMinutes, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import {
  ConnectionManager,
  Repository,
} from 'typeorm';
import { AppointmentService } from "./AppointmentService";

const appointmentRepo: Partial<Repository<Appointment>> = {
  findOneOrFail: jest.fn(),
};
const doctorRepo: Partial<Repository<Doctor>> = {
  findOneOrFail: jest.fn(),
};

describe('AppointmentService', () => {
  beforeAll(() => {
    const map = new WeakMap();
    map.set(Appointment, appointmentRepo);
    map.set(Doctor, doctorRepo);

    Container.set(ConnectionManager, createMockRepo(map));
  });

  describe('bookAppointment', () => {
    it('should not book duplicate appointment', async () => {
      const availability = new Availability();
      availability.id = 1;
      availability.dayOfWeek = 2;
      availability.startTimeUtc = '10:00';
      availability.endTimeUtc = '18:00';

      const appointment = new Appointment()
      // NOTE: Actually this code set the start time to next Tuesday instead of Monday as it say the description, so the test are adjusted to handle this case. If we need to handle the `nextMonday` we don't need to call `addDays`.
      // set appointment start time to next monday at 2pm
      const startTime = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 14), 0);
      appointment.startTime = startTime;
      appointment.durationMinutes = 15;

      const doctor = new Doctor();
      doctor.id = 1;
      doctor.availability = [availability];
      doctor.appointments = [appointment];

      doctorRepo.findOneOrFail = jest.fn(() => {
        return Promise.resolve(doctor);
      });

      const sut = Container.get(AppointmentService);

      const bookAppointmentInput: BookAppointmentInput = {
        slot: { start: startTime, end: addMinutes(startTime, 15), doctorId: doctor.id },
        patientName: faker.name.firstName(),
        description: faker.lorem.lines(1),
      };

      const call = async () => {
        await sut.bookAppointment(bookAppointmentInput);
      }

      // The `await` and `rejects` were added as otherwise the exception will not be catch and the test will fail.
      await expect(call).rejects.toThrow(Error);
      await expect(call).rejects.toThrow("Appointment slot already taken");
    });
  });
});

