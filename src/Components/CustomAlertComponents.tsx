import React from 'react';
import {StyleSheet, Modal, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface AlertProps {
  onPressNegativeButton: Function;
  onPressPositiveButton: Function;
  displayAlert: boolean;
  alertTitleText: string;
  alertMessageText: string;
}

export const CustomAlertComponent: React.FC<AlertProps> = ({
  onPressNegativeButton,
  onPressPositiveButton,
  displayAlert,
  alertTitleText,
  alertMessageText,
}) => {
  const onNegativeButtonPress = () => {
    onPressNegativeButton();
  };

  const onPositiveButtonPress = () => {
    onPressPositiveButton();
  };

  return (
    <Modal visible={displayAlert} transparent={true} animationType={'fade'}>
      <View style={styles.mainOuterComponent}>
        <View style={styles.mainContainer}>
          <View style={styles.topPart}>
            <Icon
              size={30}
              name="bell-o"
              color="black"
              style={styles.alertIconStyle}
            />
            <Text style={styles.alertTitleTextStyle}>
              {`${alertTitleText}`}
            </Text>
          </View>
          <View style={styles.middlePart}>
            <Text style={styles.alertMessageTextStyle}>
              {`${alertMessageText}`}
            </Text>
          </View>
          <View style={styles.bottomPart}>
            <TouchableOpacity
              onPress={onNegativeButtonPress}
              style={styles.alertMessageButtonStyleN}>
              <Text style={styles.alertMessageButtonTextStyle}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPositiveButtonPress}
              style={styles.alertMessageButtonStyleP}>
              <Text style={styles.alertMessageButtonTextStyle}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088',
  },
  mainContainer: {
    flexDirection: 'column',
    height: '25%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 10,
  },
  topPart: {
    flex: 0.3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#00FF00',
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  middlePart: {
    flex: 0.5,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#FF6600',
    padding: 4,
    color: '#FFFFFF',
    fontSize: 16,
    marginVertical: 2,
  },
  bottomPart: {
    flex: 0.25,
    width: '100%',
    // borderWidth: 1,
    // borderColor: '#0066FF',
    flexDirection: 'row',
    padding: 2,
    justifyContent: 'space-evenly',
  },
  alertIconStyle: {
    // borderWidth: 1,
    // borderColor: '#cc00cc',
    height: 35,
    width: 35,
  },
  alertTitleTextStyle: {
    flex: 1,
    textAlign: 'justify',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderColor: '#660066',
    padding: 2,
    marginHorizontal: 2,
  },
  alertMessageTextStyle: {
    color: '#FFFFFF',
    textAlign: 'left',
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  alertMessageButtonStyleP: {
    width: '40%',
    paddingHorizontal: 6,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertMessageButtonStyleN: {
    width: '40%',
    paddingHorizontal: 6,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertMessageButtonTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
});
