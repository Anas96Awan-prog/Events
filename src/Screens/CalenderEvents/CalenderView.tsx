/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Calendar} from 'react-native-calendars';

interface CalendarProps {
  setSelectedDate: Function;
}

export const CalenderView: React.FC<CalendarProps> = ({setSelectedDate}) => {
  return (
    <View>
      <Calendar
        dayComponent={({date, state}) => {
          return (
            <Pressable
              onPress={() =>
                setSelectedDate(
                  new Date(date.year, date.month - 1, date.day).toDateString(),
                )
              }>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderColor: '#eee',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: state === 'disabled' ? 'gray' : 'black',
                  }}>
                  {date.day}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
