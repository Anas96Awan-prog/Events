import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CreateEventButton} from '../../Components/CreateEventButton';
import {ListCard} from '../../Components/ListCard';
import {CalenderView} from './CalenderView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EventsData} from '../../types&interfaces';

export const CalenderEvents = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [listData, setListData] = React.useState<{
    disp: EventsData[];
    all: EventsData[];
  }>({
    disp: [],
    all: [],
  });

  const fetchData = React.useCallback(
    async (arg: string) => {
      let temp = await AsyncStorage.getItem('@eventsArray');
      if (temp && temp.length > 0) {
        let test = JSON.parse(temp);
        let arr = [...test].sort(
          (a: EventsData, b: EventsData) =>
            new Date(a.startAt).valueOf() - new Date(b.startAt).valueOf(),
        );
        if (arg === 'date') {
          arr = arr.filter(a => a.date === selectedDate);
        }
        setListData({
          disp: arr,
          all: arr,
        });
      }
    },
    [selectedDate],
  );

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <View style={styles.left} />
        <View style={styles.right}>
          <CreateEventButton />
        </View>
      </View>
      <View style={styles.upper}>
        <CalenderView
          setSelectedDate={(arg: string) => {
            setSelectedDate(arg);
            fetchData('date');
          }}
        />
      </View>
      <View style={styles.lower}>
        {selectedDate.length > 0 && (
          <Text style={styles.txt}>Events for {selectedDate}</Text>
        )}
        <ListCard listData={listData.disp} fetchData={() => fetchData('')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  upper: {
    flex: 0.55,
    marginBottom: 8,
  },
  lower: {
    flex: 0.5,
    marginTop: 8,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1 / 2,
    justifyContent: 'flex-start',
  },
  right: {
    flex: 1 / 2,
    justifyContent: 'flex-end',
  },
  txt: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
