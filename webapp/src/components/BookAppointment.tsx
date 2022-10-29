import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  FormEvent,
  FormEventHandler,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
} from 'react';

import classNames from 'classnames';
import { format } from 'date-fns';

import { useBookAppointmentMutation, Appointment, Slot } from '@/generated/core.graphql';

import style from './BookAppointment.module.css';

export namespace BookAppointment {
  export interface Props {
    className?: string;
    id?: string;
    slot?: Slot;
    onClose?(): Promise<void> | void;
    onComplete?(appointment: Appointment): Promise<void> | void;
  }
}

export const BookAppointment: FunctionComponent<BookAppointment.Props> = memo(({
  className = '',
  id = '',
  slot,
  onClose,
  onComplete,
}): ReactElement => {
  const [ bookAppointment, { data, error, loading } ] = useBookAppointmentMutation();
  const [patientName, setPatientName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const overflowClassName: string = useMemo(
    (): string => classNames({
      [style['book-appointment-overflow']]: true,
      [style['book-appointment-overflow-active']]: Boolean(slot),
      [className]: true,
    }),
    [className, slot],
  );

  const formSubmitHandler: FormEventHandler<HTMLFormElement> = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      bookAppointment({
        variables: {
          input: {
            slot: {
              doctorId: slot!.doctorId,
              start: slot!.start,
              end: slot!.end,
            },
            patientName,
            description,
          },
        },
      });
    },
    [slot, patientName, description, bookAppointment],
  );

  const patientNameChangeHandler: FormEventHandler<HTMLInputElement> = useCallback(
    (event: FormEvent<HTMLInputElement>): void => {
      event.preventDefault();
      setPatientName(event.currentTarget.value);
    },
    [],
  );

  const descriptionChangeHandler: FormEventHandler<HTMLTextAreaElement> = useCallback(
    (event: FormEvent<HTMLTextAreaElement>): void => {
      event.preventDefault();
      setDescription(event.currentTarget.value);
    },
    [],
  );

  const closeClickHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      onClose?.();
    },
    [onClose],
  );

  useEffect(
    (): void => {
      if (typeof data === 'object') {
        setPatientName('');
        setDescription('');
        onComplete?.(data!.bookAppointment);
      }
    },
    [data, onComplete],
  );

  return (
    <div className={overflowClassName}>
      <form className={style['book-appointment-form']} onSubmit={formSubmitHandler}>
        <div className={style['book-appointment-form-header']}>
          <h5 className={style['book-appointment-form-title']}>{ slot?.start && slot?.end && `Book appointment on ${format(slot?.start, 'hh:mm')} - ${format(slot?.end, 'hh:mm')}` }</h5>
          <button className={style['book-appointment-form-close']} onClick={closeClickHandler} disabled={loading}>×</button>
        </div>
        <div className={style['book-appointment-form-content']}>
          <div className={style['book-appointment-form-group']}>
            <label className={style['book-appointment-input-label']} htmlFor="book-appointment-patient-name-input">Patient Name</label>
            <input
              id="book-appointment-patient-name-input"
              type="text"
              className={style['book-appointment-input-text']}
              required
              onChange={patientNameChangeHandler}
              value={patientName}
            />
          </div>
          <div className={style['book-appointment-form-group']}>
            <label className={style['book-appointment-input-label']} htmlFor="book-appointment-description-input">Description</label>
            <textarea
              id="book-appointment-description-input"
              className={style['book-appointment-input-textarea']}
              onChange={descriptionChangeHandler}
              value={description}
            />
          </div>
        </div>
        <div className={style['book-appointment-form-footer']}>
          {Boolean(error) && <span className={style['book-appointment-form-error']}>{error!.message}</span>}
          <button className={style['book-appointment-form-button']} disabled={loading} type="button" onClick={closeClickHandler}>Cancel</button>
          <button className={style['book-appointment-form-button']} disabled={loading} type="submit">{loading ? 'Please, wait...' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
});

BookAppointment.displayName = 'BookAppointment';

export default BookAppointment;