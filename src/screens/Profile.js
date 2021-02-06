import React, {
  useReducer,
  useState,
  useEffect,
  useContext,
  useCallback,
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
import {useFocusEffect} from '@react-navigation/native';

const Profile = (props) => {
  const {navigation, route} = props;
  const {state, dispatch} = useContext(store);
  const {applicant, dogs, choices} = state;

  return (
    <View style={styles.centered}>
      {choices.map((choice, i) => {
        const dog = dogs.find((d) => d.id === choice.dogId);
        if (!dog || choice.liked === false) return null;
        return (
          <View key={dog.id}>
            <Text>{dog.titel}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
