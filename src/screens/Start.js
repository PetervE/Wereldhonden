import React, {
  useReducer,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  StyleSheet,
  LogBox,
  ScrollView,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  AppState,
} from 'react-native';
import {Button, Title, Divider} from 'react-native-paper';

import {store, initialState} from '../store.js';

import Amplify, {
  Auth,
  API,
  graphqlOperation,
  DataStore,
  Hub,
  SortDirection,
  Predicates,
} from 'aws-amplify';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

const Start = (props) => {
  const {navigation, route} = props;
  const {state, dispatch} = useContext(store);
  const {user, activeItem, activeLog} = state;

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hallo</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

export default Start;
