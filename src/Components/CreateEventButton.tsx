import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {NavProps} from '../types&interfaces';

export const CreateEventButton = () => {
  const nav = useNavigation<NavProps['navigation']>();

  return (
    <Button
      containerStyle={styles.btnView}
      type="outline"
      icon={<Icon name="plus" size={15} color="black" style={styles.btnIcon} />}
      iconPosition="left"
      title="Create Event"
      onPress={() => {
        nav.navigate('CreateEvent', {});
      }}
    />
  );
};

const styles = StyleSheet.create({
  btnView: {
    // width: '40%',
    margin: 10,
  },
  btnIcon: {
    marginRight: 10,
  },
});
