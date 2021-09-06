import React from 'react';
import {View, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface DropDownProp {
  setEventTypeSelected: Function;
  isForm: boolean;
  eventTypeSelected: string;
}

type Items = {
  label: string;
  value: string;
};

export const EventTypeDropDown: React.FC<DropDownProp> = ({
  setEventTypeSelected,
  isForm,
  eventTypeSelected,
}) => {
  const EventTypes: Items[] = [
    {label: 'Event', value: 'Event'},
    {label: 'Out of Office', value: 'Out of Office'},
    {label: 'Task', value: 'Task'},
  ];
  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={value => setEventTypeSelected(value)}
        placeholder={{
          label: isForm ? 'Select Event Type' : 'All',
          value: isForm ? null : 'All',
        }}
        style={{inputAndroid: styles.inputAndroid, inputIOS: styles.inputIOS}}
        items={EventTypes}
        value={eventTypeSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'blue',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginLeft: 10,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    // borderColor: 'blue',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
