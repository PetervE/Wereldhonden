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
import {
  Avatar,
  Button,
  Title,
  Divider,
  Card,
  Paragraph,
} from 'react-native-paper';
import {Loader, Centered} from '../components/common';

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
  const {user, dogs} = state;

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
      const items = data.listDogs.items.reduce((memo, item) => {
        if (item.status !== 'geadopteerd') {
          memo.push({
            ...item,
            fotos: item.fotos ? JSON.parse(item.fotos) : false,
            videos: item.videos ? JSON.parse(item.videos) : false,
          });
        }
        return memo;
      }, []);
      console.log(items.length);
      dispatch({type: 'SET_DOGS', payload: items});
    } catch (e) {
      console.log('Error init', e);
    }
  };

  if (!dogs.length) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 0}}>
          {dogs.map((d, i) => {
            return (
              <View key={`dog-${i}`}>
                <Card>
                  <Card.Title title={d.titel} subtitle={d.type} />
                  <Card.Cover
                    source={{uri: `https://wereldhonden.nl${d.fotos[0]}`}}
                  />
                  <Card.Actions></Card.Actions>
                </Card>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
