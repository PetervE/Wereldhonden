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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withTheme, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Amplify, {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import {Loader, Centered} from './components/common';

import Start from './screens/Start';
import Admin from './screens/Admin';

import {store, StateProvider, initialState} from './store.js';

const Stack = createStackNavigator();

const Navigation = (props) => {
  const {theme, navigation} = props;

  const {state, dispatch} = useContext(store);
  const {applicant} = state;

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const createUser = async () => {
    const {data} = await API.graphql({
      query: mutations.createApplicant,
      variables: {input: {}},
    });
    console.log('create', data);

    await AsyncStorage.setItem('@user', data.createApplicant.id);
    dispatch({
      type: 'SET_APPLICANT',
      payload: data.createApplicant,
    });
  };

  const init = async () => {
    const value = await AsyncStorage.getItem('@user');
    if (value) {
      // get user
      const {data} = await API.graphql({
        query: queries.getApplicant,
        variables: {id: value},
      });
      if (data.getApplicant) {
        dispatch({type: 'SET_APPLICANT', payload: data.getApplicant});
      } else {
        createUser();
      }
    } else {
      createUser();
    }
  };

  if (!applicant) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

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
