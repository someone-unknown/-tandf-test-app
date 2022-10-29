import { BookAppointmentInput } from '@/models/appointments/BookAppointmentInput';
import supertest from 'supertest';

import { Api } from '../api';

export const bookAppointment = (api: Api, bookAppointmentInput: BookAppointmentInput): supertest.Test =>
api.post('').send({
  query: `
    mutation BookAppointment($bookAppointmentInput: BookAppointmentInput!) {
      bookAppointment(bookAppointmentInput: $bookAppointmentInput) {
        id
        doctor {
          id
          name
        }
        startTime
        durationMinutes
        patientName
        description
      }
    }
`, // not enough arguments in bookAppointment body to pass the test
  variables: {
    bookAppointmentInput,
  },
});
