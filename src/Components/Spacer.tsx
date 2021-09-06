import React from 'react';
import {StyleSheet, View} from 'react-native';

const Spacer: React.FC<{children: any}> = ({children}) => {
  return <View style={styles.spacer}>{children}</View>;
};

export default Spacer;

const styles = StyleSheet.create({
  spacer: {
    marginHorizontal: 16,
    marginVertical: 2,
  },
});
