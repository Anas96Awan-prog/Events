import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {AlertProps, CustomAlertComponent} from './CustomAlertComponents';
import {EventsData, NavProps} from '../types&interfaces';
import {NoDataFound} from '../Components/NoDataFound';

interface ListProps {
  listData: any;
  fetchData: Function;
}

export const ListCard: React.FC<ListProps> = ({listData, fetchData}) => {
  const nav = useNavigation<NavProps['navigation']>();
  const [alertData, setAlertData] = useState<AlertProps>({
    alertMessageText: '',
    alertTitleText: '',
    displayAlert: false,
    onPressPositiveButton: () => {},
    onPressNegativeButton: () => {},
  });

  const clearAlert = () => {
    setAlertData({
      alertMessageText: '',
      alertTitleText: '',
      displayAlert: false,
      onPressPositiveButton: () => {},
      onPressNegativeButton: () => {},
    });
  };

  const handleDeleteEvent = async (id: string) => {
    let arr = listData;
    arr = arr.filter((t: EventsData) => t.id !== id);
    await AsyncStorage.setItem('@eventsArray', JSON.stringify(arr));
    fetchData();
    clearAlert();
  };

  const handleDeleteEventClick = (id: string) => {
    setAlertData({
      displayAlert: true,
      alertMessageText: 'Do you want to delete the Event',
      alertTitleText: 'Delete',
      onPressNegativeButton: () => clearAlert(),
      onPressPositiveButton: () => handleDeleteEvent(id),
    });
  };

  const handleEditEventClick = (id: string) => {
    setAlertData({
      displayAlert: true,
      alertMessageText: 'Do you want to Edit the Event',
      alertTitleText: 'Update',
      onPressNegativeButton: () => clearAlert(),
      onPressPositiveButton: () => {
        nav.navigate('CreateEvent', {id});
        clearAlert();
      },
    });
  };

  const renderItem = ({item}: {item: any}) => {
    return (
      <View>
        <View style={styles.row}>
          <View>
            <View style={styles.txtContainer}>
              <Text style={styles.nameTxt}>{item.title}</Text>
              <View style={styles.iconContainer}>
                <Icon
                  name="remove"
                  size={20}
                  color="black"
                  style={styles.icon}
                  onPress={() => handleDeleteEventClick(item.id)}
                />
                <Icon
                  name="edit"
                  size={20}
                  color="black"
                  style={styles.icon}
                  onPress={() => handleEditEventClick(item.id)}
                />
              </View>
            </View>
            <View style={styles.txtContainer}>
              <Text style={styles.time}>
                {new Date(item.startAt).toLocaleString()} -{' '}
                {new Date(item.endAt).toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.txtContainer}>
              <Text style={styles.mblTxt}>{item.desc}</Text>
            </View>
            <View style={styles.txtContainer}>
              <Text style={styles.nameTxt}>{item.type}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <CustomAlertComponent
        alertMessageText={alertData.alertMessageText}
        alertTitleText={alertData.alertTitleText}
        displayAlert={alertData.displayAlert}
        onPressNegativeButton={alertData.onPressNegativeButton}
        onPressPositiveButton={alertData.onPressPositiveButton}
      />
      <FlatList
        data={listData}
        renderItem={renderItem}
        ListEmptyComponent={<NoDataFound />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  txtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
    marginLeft: 15,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontWeight: '400',
    color: '#666',
    fontSize: 12,
    marginLeft: 15,
  },
  icon: {
    height: 28,
    width: 28,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
