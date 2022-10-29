import React, {
  memo,
  useCallback,
  useState,
  FunctionComponent,
  ReactElement,
} from 'react';

import { Heading, Box } from '@chakra-ui/react';

import { DoctorSelector } from '@/components/DoctorSelector';
import { SlotSelector } from '@/components/SlotSelector';
import { Doctor } from '@/generated/core.graphql';

export const Appointments: FunctionComponent = memo((): ReactElement => {
  const [ selectedDoctor, setSelectedDoctor ] = useState<Doctor | null>(null);

  const doctorSelectorChangeHandler: (doctor: Doctor) => void = useCallback(setSelectedDoctor, [setSelectedDoctor]);

  return (
    <Box>
      <Heading>Appointments</Heading>
      <DoctorSelector
        onChange={doctorSelectorChangeHandler}
      />
      {selectedDoctor && (
        <SlotSelector
          doctor={selectedDoctor}
        />
      )}
    </Box>
  );
});

Appointments.displayName = 'Appointments';

export default Appointments;