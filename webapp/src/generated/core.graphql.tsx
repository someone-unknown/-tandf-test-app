import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AddItemInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Appointment = {
  __typename?: 'Appointment';
  description: Scalars['String'];
  doctor: Doctor;
  durationMinutes: Scalars['Float'];
  id: Scalars['Float'];
  patientName: Scalars['String'];
  startTime: Scalars['DateTime'];
};

export type Availability = {
  __typename?: 'Availability';
  dayOfWeek: Scalars['Float'];
  doctor: Doctor;
  endTimeUtc: Scalars['String'];
  id: Scalars['Float'];
  startTimeUtc: Scalars['String'];
};

export type AvailabilityInput = {
  dayOfWeek: Scalars['Float'];
  endTimeUtc: Scalars['String'];
  startTimeUtc: Scalars['String'];
};

export type BookAppointmentInput = {
  description: Scalars['String'];
  patientName: Scalars['String'];
  slot: SlotInput;
};

export type Doctor = {
  __typename?: 'Doctor';
  appointments?: Maybe<Array<Appointment>>;
  availability?: Maybe<Array<Availability>>;
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type DoctorInput = {
  availability?: InputMaybe<Array<AvailabilityInput>>;
  id?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type Item = {
  __typename?: 'Item';
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addItem: Item;
  bookAppointment: Appointment;
  doctor: Doctor;
};


export type MutationAddItemArgs = {
  item: AddItemInput;
};


export type MutationBookAppointmentArgs = {
  bookAppointmentInput: BookAppointmentInput;
};


export type MutationDoctorArgs = {
  doctor: DoctorInput;
};

export type Query = {
  __typename?: 'Query';
  appointments: Array<Appointment>;
  doctors: Array<Doctor>;
  items: Array<Item>;
  slots: Array<Slot>;
};


export type QuerySlotsArgs = {
  from: Scalars['DateTime'];
  to: Scalars['DateTime'];
};

export type Slot = {
  __typename?: 'Slot';
  doctorId: Scalars['Float'];
  end: Scalars['DateTime'];
  start: Scalars['DateTime'];
};

export type SlotInput = {
  doctorId: Scalars['Float'];
  end: Scalars['DateTime'];
  start: Scalars['DateTime'];
};

export type BookAppointmentMutationVariables = Exact<{
  input: BookAppointmentInput;
}>;


export type BookAppointmentMutation = { __typename?: 'Mutation', bookAppointment: { __typename?: 'Appointment', id: number, startTime: any, durationMinutes: number, patientName: string, description: string, doctor: { __typename?: 'Doctor', id: number, name: string } } };

export type AddDoctorMutationVariables = Exact<{
  input: DoctorInput;
}>;


export type AddDoctorMutation = { __typename?: 'Mutation', doctor: { __typename?: 'Doctor', id: number, name: string, availability?: Array<{ __typename?: 'Availability', dayOfWeek: number, startTimeUtc: string, endTimeUtc: string }> | null } };

export type AddItemMutationVariables = Exact<{
  item: AddItemInput;
}>;


export type AddItemMutation = { __typename?: 'Mutation', addItem: { __typename?: 'Item', id: number, name: string, description?: string | null } };

export type AppointmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppointmentsQuery = { __typename?: 'Query', appointments: Array<{ __typename?: 'Appointment', id: number, startTime: any, durationMinutes: number, patientName: string, description: string, doctor: { __typename?: 'Doctor', id: number, name: string } }> };

export type DoctorsQueryVariables = Exact<{ [key: string]: never; }>;


export type DoctorsQuery = { __typename?: 'Query', doctors: Array<{ __typename?: 'Doctor', id: number, name: string }> };

export type SlotsQueryVariables = Exact<{
  from: Scalars['DateTime'];
  to: Scalars['DateTime'];
}>;


export type SlotsQuery = { __typename?: 'Query', slots: Array<{ __typename?: 'Slot', doctorId: number, start: any, end: any }> };

export type ItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: number, name: string, description?: string | null }> };


export const BookAppointmentDocument = gql`
    mutation bookAppointment($input: BookAppointmentInput!) {
  bookAppointment(bookAppointmentInput: $input) {
    id
    startTime
    durationMinutes
    patientName
    description
    doctor {
      id
      name
    }
  }
}
    `;
export type BookAppointmentMutationFn = Apollo.MutationFunction<BookAppointmentMutation, BookAppointmentMutationVariables>;

/**
 * __useBookAppointmentMutation__
 *
 * To run a mutation, you first call `useBookAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookAppointmentMutation, { data, loading, error }] = useBookAppointmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBookAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<BookAppointmentMutation, BookAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useMutation<BookAppointmentMutation, BookAppointmentMutationVariables>(BookAppointmentDocument, options);
      }
export type BookAppointmentMutationHookResult = ReturnType<typeof useBookAppointmentMutation>;
export type BookAppointmentMutationResult = Apollo.MutationResult<BookAppointmentMutation>;
export type BookAppointmentMutationOptions = Apollo.BaseMutationOptions<BookAppointmentMutation, BookAppointmentMutationVariables>;
export const AddDoctorDocument = gql`
    mutation addDoctor($input: DoctorInput!) {
  doctor(doctor: $input) {
    id
    name
    availability {
      dayOfWeek
      startTimeUtc
      endTimeUtc
    }
  }
}
    `;
export type AddDoctorMutationFn = Apollo.MutationFunction<AddDoctorMutation, AddDoctorMutationVariables>;

/**
 * __useAddDoctorMutation__
 *
 * To run a mutation, you first call `useAddDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDoctorMutation, { data, loading, error }] = useAddDoctorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddDoctorMutation(baseOptions?: Apollo.MutationHookOptions<AddDoctorMutation, AddDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useMutation<AddDoctorMutation, AddDoctorMutationVariables>(AddDoctorDocument, options);
      }
export type AddDoctorMutationHookResult = ReturnType<typeof useAddDoctorMutation>;
export type AddDoctorMutationResult = Apollo.MutationResult<AddDoctorMutation>;
export type AddDoctorMutationOptions = Apollo.BaseMutationOptions<AddDoctorMutation, AddDoctorMutationVariables>;
export const AddItemDocument = gql`
    mutation addItem($item: AddItemInput!) {
  addItem(item: $item) {
    id
    name
    description
  }
}
    `;
export type AddItemMutationFn = Apollo.MutationFunction<AddItemMutation, AddItemMutationVariables>;

/**
 * __useAddItemMutation__
 *
 * To run a mutation, you first call `useAddItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addItemMutation, { data, loading, error }] = useAddItemMutation({
 *   variables: {
 *      item: // value for 'item'
 *   },
 * });
 */
export function useAddItemMutation(baseOptions?: Apollo.MutationHookOptions<AddItemMutation, AddItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useMutation<AddItemMutation, AddItemMutationVariables>(AddItemDocument, options);
      }
export type AddItemMutationHookResult = ReturnType<typeof useAddItemMutation>;
export type AddItemMutationResult = Apollo.MutationResult<AddItemMutation>;
export type AddItemMutationOptions = Apollo.BaseMutationOptions<AddItemMutation, AddItemMutationVariables>;
export const AppointmentsDocument = gql`
    query appointments {
  appointments {
    id
    startTime
    durationMinutes
    patientName
    description
    doctor {
      id
      name
    }
  }
}
    `;

/**
 * __useAppointmentsQuery__
 *
 * To run a query within a React component, call `useAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppointmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppointmentsQuery(baseOptions?: Apollo.QueryHookOptions<AppointmentsQuery, AppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useQuery<AppointmentsQuery, AppointmentsQueryVariables>(AppointmentsDocument, options);
      }
export function useAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppointmentsQuery, AppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions};
          return Apollo.useLazyQuery<AppointmentsQuery, AppointmentsQueryVariables>(AppointmentsDocument, options);
        }
export type AppointmentsQueryHookResult = ReturnType<typeof useAppointmentsQuery>;
export type AppointmentsLazyQueryHookResult = ReturnType<typeof useAppointmentsLazyQuery>;
export type AppointmentsQueryResult = Apollo.QueryResult<AppointmentsQuery, AppointmentsQueryVariables>;
export const DoctorsDocument = gql`
    query doctors {
  doctors {
    id
    name
  }
}
    `;

/**
 * __useDoctorsQuery__
 *
 * To run a query within a React component, call `useDoctorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDoctorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDoctorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDoctorsQuery(baseOptions?: Apollo.QueryHookOptions<DoctorsQuery, DoctorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useQuery<DoctorsQuery, DoctorsQueryVariables>(DoctorsDocument, options);
      }
export function useDoctorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DoctorsQuery, DoctorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions};
          return Apollo.useLazyQuery<DoctorsQuery, DoctorsQueryVariables>(DoctorsDocument, options);
        }
export type DoctorsQueryHookResult = ReturnType<typeof useDoctorsQuery>;
export type DoctorsLazyQueryHookResult = ReturnType<typeof useDoctorsLazyQuery>;
export type DoctorsQueryResult = Apollo.QueryResult<DoctorsQuery, DoctorsQueryVariables>;
export const SlotsDocument = gql`
    query slots($from: DateTime!, $to: DateTime!) {
  slots(from: $from, to: $to) {
    doctorId
    start
    end
  }
}
    `;

/**
 * __useSlotsQuery__
 *
 * To run a query within a React component, call `useSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSlotsQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useSlotsQuery(baseOptions: Apollo.QueryHookOptions<SlotsQuery, SlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useQuery<SlotsQuery, SlotsQueryVariables>(SlotsDocument, options);
      }
export function useSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SlotsQuery, SlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions};
          return Apollo.useLazyQuery<SlotsQuery, SlotsQueryVariables>(SlotsDocument, options);
        }
export type SlotsQueryHookResult = ReturnType<typeof useSlotsQuery>;
export type SlotsLazyQueryHookResult = ReturnType<typeof useSlotsLazyQuery>;
export type SlotsQueryResult = Apollo.QueryResult<SlotsQuery, SlotsQueryVariables>;
export const ItemsDocument = gql`
    query items {
  items {
    id
    name
    description
  }
}
    `;

/**
 * __useItemsQuery__
 *
 * To run a query within a React component, call `useItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useItemsQuery(baseOptions?: Apollo.QueryHookOptions<ItemsQuery, ItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions};
        return Apollo.useQuery<ItemsQuery, ItemsQueryVariables>(ItemsDocument, options);
      }
export function useItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ItemsQuery, ItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions};
          return Apollo.useLazyQuery<ItemsQuery, ItemsQueryVariables>(ItemsDocument, options);
        }
export type ItemsQueryHookResult = ReturnType<typeof useItemsQuery>;
export type ItemsLazyQueryHookResult = ReturnType<typeof useItemsLazyQuery>;
export type ItemsQueryResult = Apollo.QueryResult<ItemsQuery, ItemsQueryVariables>;