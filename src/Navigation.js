import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
} from 'react-native';
import {withTheme, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Amplify, {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import Start from './screens/Start';
import Admin from './screens/Admin';

import {store, StateProvider, initialState} from './store.js';

const Stack = createStackNavigator();

const Navigation = (props) => {
  const {theme, navigation} = props;

  const {state} = useContext(store);
  const {dogs} = state;

  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          headerMode="float"
          screenOptions={
            {
              // headerStyle: {backgroundColor: 'red'},
              // headerTintColor: '#fff',
              // headerTitleStyle: {
              //   fontWeight: 'bold',
              // },
            }
          }>
          <Stack.Screen
            name="Start"
            component={Start}
            options={{title: `start`, headerShown: true}}
            initialParams={{theme: theme}}
          />
          <Stack.Screen
            name="Admin"
            component={Admin}
            options={{title: `admin`, headerShown: true}}
            initialParams={{theme: theme}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default withTheme(Navigation);
