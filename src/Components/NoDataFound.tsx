import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export const NoDataFound: React.FunctionComponent = () => {
  return (
    <View style={styles.centeredView}>
      <View>
        <Text>No events to show yet</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
});
