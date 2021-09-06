import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CalenderEvents, CreateEvent, EventsList} from '../Screens';
import {ParamsListStack} from '../types&interfaces';

const Stack = createNativeStackNavigator<ParamsListStack>();
const Tab = createBottomTabNavigator();

const TabsNav = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarIcon: () => null,
    }}>
    <Tab.Screen name="List View" component={EventsList} />
    <Tab.Screen name="Calender View" component={CalenderEvents} />
  </Tab.Navigator>
);

export const AppNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={TabsNav} />
        <Stack.Screen name="Calender" component={CalenderEvents} />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEvent}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
