import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  FormEvent,
  FormEventHandler,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';

import classNames from 'classnames';

import style from '@/components/DoctorSelector.module.css';
import { useDoctorsQuery, Doctor, DoctorsQueryResult } from '@/generated/core.graphql';


export namespace DoctorSelector {
  export interface Props {
    className?: string;
    id?: string;
    onChange?(doctor: Doctor): Promise<void> | void;
    onError?(error: Error): Promise<void> | void;
    onLoad?(): Promise<void> | void;
  }
}

export const DoctorSelector: FunctionComponent<DoctorSelector.Props> = memo(({
  className = '',
  id = '',
  onChange,
  onError,
  onLoad,
}): ReactElement => {
  const result: DoctorsQueryResult = useDoctorsQuery();

  const [ selectedDoctor, setSelectedDoctor ] = useState<Doctor | null>(null);

  const selectorContainerClassName: string = useMemo(
    (): string => classNames([ style['doctor-selector-container'], className ]),
    [className],
  );

  const selectorChangeHandler: FormEventHandler<HTMLSelectElement> = useCallback(
    (event: FormEvent<HTMLSelectElement>): void => {
      event.preventDefault();

      const doctors: Doctor[] | undefined = result.data?.doctors;

      if (Array.isArray(doctors) && doctors.length) {
        const selectedDoctor: Doctor | null = doctors.filter((doctor: Doctor): boolean => doctor.id === parseInt(event.currentTarget.value))[0] || null;
        setSelectedDoctor(selectedDoctor);
        onChange?.(selectedDoctor);
      }
    },
    [onChange, result.data],
  );

  const selectorInnerElement: ReactNode = useMemo(
    (): ReactNode => {
      if (result.loading) {
        return <div className={style['doctor-selector-placeholder']} />;
      } else if (result.error) {
        return <div className={style['doctor-selector-error']}>{result.error.message}</div>;
      }

      const doctors: Doctor[] | undefined = result.data?.doctors;

      if (!Array.isArray(doctors) || !doctors.length) {
        return <div className={style['doctor-selector-empty']}>No doctors found</div>;
      }

      return (
        <select
          className={style['doctor-selector-dropdown']}
          onChange={selectorChangeHandler}
          value={selectedDoctor?.id}
        >
          {doctors.map((doctor: Doctor): ReactNode => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}
        </select>
      );
    },
    [result, selectedDoctor, selectorChangeHandler],
  );

  useEffect(
    (): void => void(!result.loading && onLoad?.()),
    [onLoad, result.loading],
  );

  useEffect(
    (): void => void(result.error && onError?.(result.error)),
    [onError, result.error],
  );

  useEffect(
    (): void => {
      const doctors: Doctor[] | undefined = result.data?.doctors;

      if (Array.isArray(doctors) && doctors.length) {
        setSelectedDoctor(doctors[0]);
        onChange?.(doctors[0]);
      }
    },
    [onChange, result.data],
  );

  return (
    <div className={selectorContainerClassName} id={id}>
      {selectorInnerElement}
    </div>
  );
});

DoctorSelector.displayName = 'DoctorSelector';

export default DoctorSelector;