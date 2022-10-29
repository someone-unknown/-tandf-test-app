import supertest from 'supertest';

import { Api } from '../api';

export const fetchSlots = (api: Api): supertest.Test =>
  // modified this integration test, cause it doesn't pass "from" and "to" parameters
  api.post('').send({
    query: `
      query Slots($to: DateTime!, $from: DateTime!) {
        slots(to: $to, from: $from) {
          doctorId
          start
          end
        }
      }
    `,
    variables: {
      from: '2022-10-31T10:00:00.708Z',
      to: '2022-10-31T17:00:00.708Z'
    },
  });
