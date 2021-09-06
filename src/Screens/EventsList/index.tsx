/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
import {CreateEventButton} from '../../Components/CreateEventButton';
import {EventTypeDropDown} from '../../Components/EventTypeDropDown';
import {ListCard} from '../../Components/ListCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EventsData, NavProps} from '../../types&interfaces';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

export const EventsList = () => {
  const nav = useNavigation<NavProps['navigation']>();
  const [eventTypeSelected, setEventTypeSelected] = React.useState('');
  const [listData, setListData] = React.useState<{
    disp: EventsData[];
    all: EventsData[];
  }>({
    disp: [],
    all: [],
  });

  React.useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [nav]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      checkUpcomingEvent();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = React.useCallback(async () => {
    let temp = await AsyncStorage.getItem('@eventsArray');
    if (temp && temp.length > 0) {
      let test = JSON.parse(temp);
      let arr = [...test].sort(
        (a: EventsData, b: EventsData) =>
          new Date(a.startAt).valueOf() - new Date(b.startAt).valueOf(),
      );
      setListData({
        disp: arr,
        all: arr,
      });
    }
  }, []);

  const checkUpcomingEvent = React.useCallback(async () => {
    let temp = await AsyncStorage.getItem('@eventsArray');
    if (temp && temp.length > 0) {
      let test = JSON.parse(temp);
      let arr = [...test].sort(
        (a: EventsData, b: EventsData) =>
          new Date(a.startAt).valueOf() - new Date(b.startAt).valueOf(),
      );
      if (arr.length > 0) {
        let now = moment(new Date());
        let start = moment(arr[0].startAt);
        let duration = moment.duration(start.diff(now));
        let minutes = duration.asMinutes();
        if (minutes > 8 && minutes < 10) {
          Alert.alert('Upcoming Event', `${arr[0].title}`);
          if (Platform.OS === 'android') {
            PushNotification.localNotification({
              channelId: 'Events',
              title: 'Upcoming Event',
              message: `${arr[0].title}`,
            });
          } else if (Platform.OS === 'ios') {
            PushNotificationIOS.addNotificationRequest({
              id: 'Events',
              title: 'Upcoming Event',
              body: `${arr[0].title}`,
            });
          }
        }
      }
    }
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.left}>
          <EventTypeDropDown
            isForm={false}
            setEventTypeSelected={(arg: string) => {
              console.log(arg);
              if (arg !== 'All') {
                let temp = listData.all;
                temp = temp.filter(t => t.type === arg);
                setListData({
                  ...listData,
                  disp: temp,
                });
              } else {
                setListData({
                  ...listData,
                  disp: listData.all,
                });
              }
              setEventTypeSelected(arg);
            }}
            eventTypeSelected={eventTypeSelected}
          />
        </View>
        <View style={styles.right}>
          <CreateEventButton />
        </View>
      </View>
      <ListCard fetchData={() => fetchData()} listData={listData.disp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});
