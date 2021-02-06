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

  const [likes, setLikes] = useState([]);
  const [likedDogs, setLikedDogs] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const items = choices.reduce((memo, item) => {
        if (item.liked === true) memo.push(item);
        return memo;
      }, []);
      setLikes(items);
    }, []),
  );

  useEffect(() => {
    if (!likes.length) return;
    let items = [];
    likes.map((l) => {
      const find = dogs.find((d) => d.id === l.dogId);
      if (find) items.push(find);
    });
    setLikedDogs(items);
  }, [likes]);

  return (
    <View style={styles.centered}>
      {likedDogs.map((x) => {
        return <Text>{x.titel}</Text>;
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
