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
import {Button, Title, Divider, Card} from 'react-native-paper';

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

  const likedDogs = choices.reduce((memo, choice) => {
    const find = dogs.find((d) => d.id === choice.dogId);
    if (find && choice.liked === true) memo.push(find);
    return memo;
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <SafeAreaView>
        <Title style={{paddingHorizontal: 16}}>
          {likedDogs.length > 1
            ? `${likedDogs.length} dogs`
            : `${likedDogs.length} dog`}
        </Title>
      </SafeAreaView>
      <View style={styles.dogsContainer}>
        {likedDogs.map((dog, i) => {
          return (
            <View style={styles.cardContainer} key={dog.id}>
              <Card>
                <Card.Title title={dog.titel} subtitle={dog.type} />
                <Card.Cover
                  source={{uri: `https://wereldhonden.nl${dog.fotos[0]}`}}
                />
                <Card.Actions></Card.Actions>
              </Card>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogsContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  cardContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default Profile;
