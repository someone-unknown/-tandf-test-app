import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

// eslint-disable-next-line import/order
import FullCalendar, { EventInput, EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import classNames from 'classnames';
import { addDays } from 'date-fns';

import { BookAppointment } from '@/components/BookAppointment';
import '@fullcalendar/common/main.css';
import style from '@/components/SlotSelector.module.css';
import { useSlotsLazyQuery, Doctor, Slot, SlotsLazyQueryHookResult } from '@/generated/core.graphql';

export namespace SlotSelector {
  export interface Props {
    className?: string;
    id?: string;
    doctor?: Doctor;
  }
}

export const SlotSelector: FunctionComponent<SlotSelector.Props> = memo(({
  className = '',
  id = '',
  doctor,
}): ReactElement => {
  const [ getSlots, result ]: SlotsLazyQueryHookResult = useSlotsLazyQuery();

  const [ selectedSlot, setSelectedSlot ] = useState<Slot | undefined>(undefined);

  const selectorContainerClassName: string = useMemo(
    (): string => classNames([ style['slot-selector-container'], className ]),
    [className],
  );

  const bookAppointmentCloseHandler: () => void = useCallback(
    (): void => setSelectedSlot(undefined),
    [],
  );

  const bookAppointmentCompleteHandler: () => void = useCallback(
    (): void => {
      setSelectedSlot(undefined);
      getSlots({
        variables: {
          from: new Date(Date.now()),
          to: addDays(new Date(Date.now()), 30),
        },
      });
    },
    [getSlots],
  );

  const selectorInnerElement: ReactNode = useMemo(
    (): ReactNode => {
      if (result.loading) {
        return <div className={style['doctor-selector-placeholder']} />;
      } else if (result.error) {
        return <div className={style['doctor-selector-error']}>{result.error.message}</div>;
      }

      const slots: Slot[] | undefined = result.data?.slots;

      if (!Array.isArray(slots) || !slots.length) {
        return <div className={style['doctor-selector-empty']}>No slots found</div>;
      }

      return (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          selectable
          expandRows
          initialView="timeGridWeek"
          events={slots.filter((slot: Slot): boolean => slot.doctorId === doctor?.id).map((slot: Slot): EventInput => ({ title: 'Available slot', start: slot.start, end: slot.end }))}
          eventClick={(data: EventClickArg): void => {
            setSelectedSlot({ doctorId: doctor!.id, start: data.event.start, end: data.event.end });
          }}
        />
      );
    },
    [result, doctor],
  );

  useEffect(
    (): void => {
      getSlots({
        variables: {
          from: new Date(Date.now()),
          to: addDays(new Date(Date.now()), 30),
        },
      });
    },
    [getSlots],
  );

  return (
    <div className={selectorContainerClassName} id={id}>
      {selectorInnerElement}
      <BookAppointment
        slot={selectedSlot}
        onClose={bookAppointmentCloseHandler}
        onComplete={bookAppointmentCompleteHandler}
      />
    </div>
  );
});

SlotSelector.displayName = 'SlotSelector';

export default SlotSelector;