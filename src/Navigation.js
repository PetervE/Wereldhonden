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
  const {applicant, dogs, choices} = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
    return () => {};
  }, []);

  useEffect(() => {
    if (applicant && applicant.id) getChoices();
  }, [applicant]);

  const getChoices = async () => {
    const {
      data: {choicesByApplicant},
    } = await API.graphql({
      query: queries.choicesByApplicant,
      variables: {applicantId: applicant.id},
    });
    // console.log('choices', choicesByApplicant.items);
    dispatch({type: 'SET_CHOICES', payload: choicesByApplicant.items});
    setLoading(false);
  };

  const createUser = async () => {
    const {data} = await API.graphql({
      query: mutations.createApplicant,
      variables: {input: {}},
    });
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
      const {
        data: {getApplicant},
      } = await API.graphql({
        query: queries.getApplicant,
        variables: {id: value},
      });
      if (getApplicant) {
        // console.log('user', getApplicant);
        dispatch({type: 'SET_APPLICANT', payload: getApplicant});
      } else {
        createUser();
      }
    } else {
      createUser();
    }

    const {
      data: {listDogs},
    } = await API.graphql({
      query: queries.listDogs,
      variables: {},
    });
    if (!listDogs) return console.log('Error scrape: no data');
    const items = listDogs.items.reduce((memo, item) => {
      if (item.status !== 'geadopteerd') {
        memo.push({
          ...item,
          fotos: item.fotos ? JSON.parse(item.fotos) : false,
          videos: item.videos ? JSON.parse(item.videos) : false,
        });
      }
      return memo;
    }, []);
    // console.log('dogs', dogs);
    dispatch({type: 'SET_DOGS', payload: items});
  };

  if (loading) {
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
            options={{title: `start`, headerShown: false}}
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
