import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ParamsListStack = {
  Home: undefined;
  Calender: undefined;
  CreateEvent: {id?: string};
};

export interface FormErrors {
  eventTitle: undefined | string;
  startTime: undefined | string;
  endTime: undefined | string;
  startDate: undefined | string;
  slot: undefined | string;
  eventTypeSelected: undefined | string;
}

export type NavProps = NativeStackScreenProps<ParamsListStack>;

export interface EventsData {
  title: string;
  startAt: Date | string;
  endAt: Date | string;
  desc?: string;
  id: string | undefined;
  date: Date | string;
  type: string;
}
