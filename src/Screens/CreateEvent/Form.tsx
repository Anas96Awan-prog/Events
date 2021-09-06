/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Text,
} from 'react-native';
import {Button, Input, Icon} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Spacer from '../../Components/Spacer';
import {nullCheck} from '../../Components/globals';
import {EventTypeDropDown} from '../../Components/EventTypeDropDown';
import {EventsData, FormErrors, NavProps} from '../../types&interfaces';

export const CreateEventForm = () => {
  const nav = useNavigation<NavProps['navigation']>();
  const [eventTypeSelected, setEventTypeSelected] = React.useState('');
  const [toggle, setToggle] = useState<{
    calendar: boolean;
    time1: boolean;
    time2: boolean;
  }>({
    calendar: false,
    time1: false,
    time2: false,
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>('');
  const [startDate, setStartDate] = useState<Date | string>('');
  const [startTime, setStartTime] = useState({
    value: '',
    temp: new Date(),
  });
  const [endTime, setEndTime] = useState({
    value: '',
    temp: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [errorMsgs, setErrorMsgs] = useState<FormErrors>({
    eventTitle: undefined,
    startTime: undefined,
    startDate: undefined,
    endTime: undefined,
    slot: undefined,
    eventTypeSelected: undefined,
  });
  const [input, setInput] = useState({
    eventTitle: '',
    eventDesc: '',
  });

  React.useEffect(() => {
    if (nav.getState().routes[1].params?.id) {
      let id = nav.getState()?.routes[1]?.params?.id;
      fetchDetails(id);
    }
  }, []);

  const fetchDetails = React.useCallback(async id => {
    setLoading(true);
    const res = await AsyncStorage.getItem('@eventsArray');
    let data = res && JSON.parse(res);
    if (data && data.length > 0) {
      let temp = data.filter((Dt: EventsData) => Dt.id === id);
      let eYear = moment(temp[0].date).year(),
        eMonth = moment(temp[0].date).month(),
        eDay = moment(temp[0].date).date(),
        eHour = moment(temp[0].startAt).hour(),
        eMinute = moment(temp[0].startAt).minute(),
        eHour1 = moment(temp[0].endAt).hour(),
        eMinute1 = moment(temp[0].endAt).minute();
      setInput({
        eventDesc: temp[0].desc,
        eventTitle: temp[0].title,
      });
      setEndTime({
        value: `${eHour1} : ${eMinute1 < 10 ? '0' + eMinute1 : eMinute1}`,
        temp: new Date(eYear, eMonth, eDay, eHour1, eMinute1),
      });
      setStartTime({
        value: `${eHour} : ${eMinute < 10 ? '0' + eMinute : eMinute}`,
        temp: new Date(eYear, eMonth, eDay, eHour, eMinute),
      });
      setEventTypeSelected(temp[0].type);
      setStartDate(new Date(temp[0].date).toDateString());
      setEditId(id);
      setEditMode(true);
    }
    setLoading(false);
  }, []);

  const handleEndTime = (date: Date) => {
    let eYear = moment(startDate).year(),
      eMonth = moment(startDate).month(),
      eDay = moment(startDate).date(),
      eHour = moment(date).hour(),
      eMinute = moment(date).minute();
    setEndTime({
      value: `${eHour} : ${eMinute < 10 ? '0' + eMinute : eMinute}`,
      temp: new Date(eYear, eMonth, eDay, eHour, eMinute),
    });
    clearError('endTime');
    clearError('slot');
    pickerClose('time2');
    Keyboard.dismiss();
  };

  const handleStartTime = (date: Date) => {
    let eYear = moment(startDate).year(),
      eMonth = moment(startDate).month(),
      eDay = moment(startDate).date(),
      eHour = moment(date).hour(),
      eMinute = moment(date).minute();
    setStartTime({
      value: `${eHour} : ${eMinute < 10 ? '0' + eMinute : eMinute}`,
      temp: new Date(eYear, eMonth, eDay, eHour, eMinute),
    });
    clearError('startTime');
    clearError('slot');
    pickerClose('time1');
    Keyboard.dismiss();
  };

  const checkEvent = () => {
    let valid = true;
    if (nullCheck(eventTypeSelected)) {
      setError('eventTypeSelected', 'Select Type');
      valid = false;
    } else if (nullCheck(input.eventTitle)) {
      setError('eventTitle', 'Required');
      valid = false;
    } else if (nullCheck(startDate)) {
      setError('startDate', 'Select Date');
      valid = false;
    } else if (nullCheck(startTime.value)) {
      setError('startTime', 'Set Start Time');
      valid = false;
    } else if (nullCheck(endTime.value)) {
      setError('endTime', 'Set End Time');
      valid = false;
    }
    return valid;
  };

  const setError = (state: string, msg: string) => {
    setErrorMsgs({
      ...errorMsgs,
      [state]: msg,
    });
  };

  const clearError = (state: string) => {
    setErrorMsgs({
      ...errorMsgs,
      [state]: undefined,
    });
  };

  const pickerClose = (type: string) => {
    setToggle({
      ...toggle,
      [type]: false,
    });
  };

  const pickerOpen = (type: string) => {
    setToggle({
      ...toggle,
      [type]: true,
    });
  };

  const timecheck = () => {
    let t = moment(new Date()).toLocaleString();
    let date = {
      year: new Date(startDate).getFullYear(),
      month: new Date(startDate).getMonth(),
      day: new Date(startDate).getDate(),
    };
    let start = {
      hour: moment(startTime.temp).hour(),
      minute: moment(startTime.temp).minute(),
    };
    let end = {
      hour: moment(endTime.temp).hour(),
      minute: moment(endTime.temp).minute(),
    };
    let startAt = moment(
      new Date(date.year, date.month, date.day, start.hour, start.minute),
    ).toLocaleString();
    let endAt = moment(
      new Date(date.year, date.month, date.day, end.hour, end.minute),
    ).toLocaleString();
    if (
      moment(startAt).isSameOrAfter(endAt) ||
      moment(endAt).isSameOrBefore(startAt)
    ) {
      return {err: true, msg: 'End Time Should be Greater than Start Time'};
    } else if (
      moment(startAt).isSameOrBefore(t) ||
      moment(endAt).isSameOrBefore(t)
    ) {
      return {
        err: true,
        msg: 'Start or End Time should not be before or same to current time',
      };
    } else {
      return {err: false, msg: ''};
    }
  };

  const saveEventData = async (obj: EventsData) => {
    let arr = [];
    let temp = await AsyncStorage.getItem('@eventsArray');
    if (temp && temp.length > 0) {
      let test = JSON.parse(temp);
      arr = [...test];
      if (editMode) {
        arr = arr.filter(a => a.id !== editId);
      }
      arr.push(obj);
    } else {
      arr.push(obj);
    }
    await AsyncStorage.setItem('@eventsArray', JSON.stringify(arr));
    nav.navigate('Home');
  };

  const handleEvent = async () => {
    let valid = checkEvent();
    if (valid) {
      let time = timecheck();
      if (time.err) {
        setError('slot', time.msg);
      } else {
        let obj = {
          id: editMode
            ? editId
            : `${input.eventTitle}-${startTime.temp}-${endTime.temp}/${startDate}`,
          title: input.eventTitle,
          desc: input.eventDesc,
          date: startDate,
          startAt: startTime.temp,
          endAt: endTime.temp,
          type: eventTypeSelected,
        };
        let slotBooked = false;
        let temp = await AsyncStorage.getItem('@eventsArray');
        let tempData = temp ? JSON.parse(temp) : [];
        if (tempData && tempData.length > 0) {
          let startAt = moment(obj.startAt);
          let day = moment(startDate);
          let endAt = moment(obj.endAt);
          let test = tempData;
          if (editMode) {
            test = test.filter((t: EventsData) => t.id !== editId);
          }
          test.map((td: EventsData) => {
            let s = moment(td.startAt);
            let d = moment(td.date);
            let e = moment(td.endAt);
            if (day.isSame(d, 'day')) {
              if (startAt.isSame(s) && endAt.isSame(e)) {
                slotBooked = true;
              } else if (startAt.isAfter(s) && endAt.isBefore(e)) {
                slotBooked = true;
              } else if (startAt.isAfter(s) && endAt.isSame(e)) {
                slotBooked = true;
              } else if (startAt.isBefore(s) && endAt.isSameOrAfter(e)) {
                slotBooked = true;
              } else if (startAt.isBetween(s, e) || endAt.isBetween(s, e)) {
                slotBooked = true;
              } else if (startAt.isSame(s) && endAt.isAfter(e)) {
                slotBooked = true;
              } else if (startAt.isSame(s) && endAt.isBefore(e)) {
                slotBooked = true;
              } else if (startAt.isBefore(s) && endAt.isSame(e)) {
                slotBooked = true;
              }
            }
          });
        }
        if (!slotBooked) {
          saveEventData(obj);
        } else {
          setError('slot', 'Slot Not Available');
        }
      }
    }
  };

  const handleDateSelect = (date: Date) => {
    clearError('startDate');
    setStartDate(date.toDateString());
    setStartTime({
      value: '',
      temp: new Date(
        moment(date).year(),
        moment(date).month(),
        moment(date).date(),
        moment(date).isSame(new Date()) ? date.getHours() : 0,
        moment(date).isSame(new Date()) ? date.getMinutes() : 0,
      ),
    });
    setEndTime({
      value: '',
      temp: new Date(
        moment(date).year(),
        moment(date).month(),
        moment(date).date(),
        moment(date).isSame(new Date()) ? date.getHours() : 0,
        moment(date).isSame(new Date()) ? date.getMinutes() : 0,
      ),
    });
    pickerClose('calendar');
    Keyboard.dismiss();
  };

  const setValue = (name: string, value: string): void => {
    setInput({
      ...input,
      [name]: value,
    });
    clearError(name);
  };

  return (
    <KeyboardAvoidingView behavior={'height'}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Spacer>
          <EventTypeDropDown
            isForm={true}
            setEventTypeSelected={(arg: string) => {
              setEventTypeSelected(arg);
              clearError('eventTypeSelected');
            }}
            eventTypeSelected={eventTypeSelected}
          />
          <View>
            {errorMsgs.eventTypeSelected && (
              <Text style={styles.errorMsg}>
                {' '}
                {errorMsgs.eventTypeSelected}
              </Text>
            )}
          </View>
        </Spacer>
        <Spacer>
          <Input
            label="Name"
            value={input.eventTitle}
            autoFocus
            onChangeText={val => setValue('eventTitle', val)}
            autoCapitalize="none"
            errorMessage={errorMsgs.eventTitle}
            autoCorrect={false}
          />
        </Spacer>
        <Spacer>
          <Input
            label="Description"
            value={input.eventDesc}
            onChangeText={val => setValue('eventDesc', val)}
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Spacer>
        <Spacer>
          <View>
            <View style={styles.date_input_container}>
              <View style={{width: Dimensions.get('screen').width * 0.9}}>
                <Input
                  label="Start Date"
                  onTouchStart={() => {
                    pickerOpen('calendar');
                    Keyboard.dismiss();
                  }}
                  rightIcon={
                    toggle.calendar ? (
                      <Icon
                        name="chevron-up"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerClose('calendar')}
                      />
                    ) : (
                      <Icon
                        name="chevron-down"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerOpen('calendar')}
                      />
                    )
                  }
                  value={startDate.toString()}
                  errorMessage={errorMsgs.startDate}
                />
                <DateTimePickerModal
                  isVisible={toggle.calendar}
                  mode="date"
                  date={startDate ? new Date(startDate) : new Date()}
                  minimumDate={new Date()}
                  onCancel={() => pickerClose('calendar')}
                  onConfirm={(date: Date) => {
                    handleDateSelect(date);
                  }}
                />
              </View>
              <View style={{width: Dimensions.get('window').width * 0.1}} />
            </View>
            <View style={styles.date_input_container}>
              <View style={{width: Dimensions.get('screen').width * 0.4}}>
                <Input
                  onTouchStart={() => {
                    if (!nullCheck(startDate)) {
                      pickerOpen('time1');
                      Keyboard.dismiss();
                    }
                  }}
                  label="Start Time"
                  rightIcon={
                    toggle.time1 ? (
                      <Icon
                        name="chevron-up"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerClose('time1')}
                      />
                    ) : (
                      <Icon
                        disabled={nullCheck(startDate)}
                        name="chevron-down"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerOpen('time1')}
                      />
                    )
                  }
                  value={startTime.value}
                  errorMessage={errorMsgs.startTime}
                />
                <DateTimePickerModal
                  isVisible={toggle.time1}
                  mode="time"
                  date={startTime.temp}
                  minuteInterval={10}
                  minimumDate={new Date()}
                  onCancel={() => pickerClose('time1')}
                  onConfirm={(date: Date) => {
                    handleStartTime(date);
                  }}
                />
              </View>
              <View style={{width: Dimensions.get('window').width * 0.4}}>
                <Input
                  onTouchStart={() => {
                    if (!nullCheck(startDate)) {
                      pickerOpen('time2');
                      Keyboard.dismiss();
                    }
                  }}
                  label="End Time"
                  rightIcon={
                    toggle.time2 ? (
                      <Icon
                        name="chevron-up"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerClose('time2')}
                      />
                    ) : (
                      <Icon
                        disabled={nullCheck(startDate)}
                        name="chevron-down"
                        type="font-awesome"
                        size={14}
                        color="#1a7a72"
                        onPress={() => pickerOpen('time2')}
                      />
                    )
                  }
                  value={endTime.value}
                  errorMessage={errorMsgs.endTime}
                />
                <DateTimePickerModal
                  isVisible={toggle.time2}
                  mode="time"
                  minuteInterval={10}
                  date={endTime.temp}
                  minimumDate={new Date()}
                  onCancel={() => pickerClose('time2')}
                  onConfirm={(date: Date) => {
                    handleEndTime(date);
                  }}
                />
              </View>
            </View>
          </View>
        </Spacer>
        <Spacer>
          <View>
            {errorMsgs.slot && (
              <Text style={styles.errorMsg}> {errorMsgs.slot}</Text>
            )}
          </View>
          <Button
            title={
              loading ? (
                <ActivityIndicator size={'small'} color="white" />
              ) : editMode ? (
                'Update Event'
              ) : (
                'Create Event'
              )
            }
            buttonStyle={styles.btn}
            onPress={handleEvent}
          />
        </Spacer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  textContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: '#024d49',
    fontSize: 16,
  },
  errorMsg: {
    margin: 10,
    color: 'red',
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#024d49',
    color: 'white',
  },
  date_input_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
