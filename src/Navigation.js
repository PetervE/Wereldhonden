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

import {store, StateProvider, initialState} from './store.js';

const Stack = createStackNavigator();

const Navigation = (props) => {
  const {theme, navigation} = props;

  const {state} = useContext(store);
  const {dogs} = state;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const {data} = await API.graphql({
        query: queries.listDogs,
        variables: {},
      });
      if (!data) return console.log('Error scrape: no data');
      const items = data.listDogs.items;
      console.log(items);
    } catch (e) {
      console.log('Error scrape', e);
    }
  };

  const scrape = async () => {
    try {
      const result = await API.get('restapi', '/scraper', {
        timeout: 60000,
      });
      console.log(result);
    } catch (e) {
      console.log('Error scrape', e);
    }
  };

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
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default withTheme(Navigation);
