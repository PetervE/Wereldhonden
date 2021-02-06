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
  Switch,
  StatusBar,
  SafeAreaView,
  AppState,
} from 'react-native';
import {
  Avatar,
  Button,
  Title,
  Checkbox,
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
  const {applicant, dogs, choices} = state;

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
    } catch (e) {
      console.log('Error init', e);
    }
  };

  const toggleDog = async (value, dog) => {
    let choice = choices.find((c) => {
      if (c.dogId === dog.id && c.applicantId === applicant.id) return c;
    });

    if (choice) {
      // update
      let payload = {...choice, liked: value};
      delete payload.applicant;
      delete payload.dog;
      delete payload.createdAt;
      delete payload.updatedAt;
      const {data} = await API.graphql({
        query: mutations.updateChoice,
        variables: {
          input: payload,
        },
      });
    } else {
      // create choice
      const {data} = await API.graphql({
        query: mutations.createChoice,
        variables: {
          input: {
            liked: value,
            dogId: dog.id,
            applicantId: applicant.id,
          },
        },
      });
    }
    const {
      data: {choicesByApplicant},
    } = await API.graphql({
      query: queries.choicesByApplicant,
      variables: {applicantId: applicant.id},
    });
    dispatch({type: 'SET_CHOICES', payload: choicesByApplicant.items});
    console.log('choices', choicesByApplicant.items);
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
        <View style={styles.dogsContainer}>
          {dogs.map((d, i) => {
            let value;
            let choice = choices.find((c) => {
              if (c.dogId === d.id && c.applicantId === applicant.id) return c;
            });
            if (choice) value = choice.liked;

            return (
              <View style={styles.cardContainer} key={`dog-${i}`}>
                <Card>
                  <Card.Title title={d.titel} subtitle={d.type} />
                  <Card.Cover
                    source={{uri: `https://wereldhonden.nl${d.fotos[0]}`}}
                  />
                  <Card.Actions>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={(value) => toggleDog(value, d)}
                      value={value}
                    />
                  </Card.Actions>
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
  dogsContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  cardContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default Start;
