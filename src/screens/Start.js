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
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
import {NavigationContainer} from '@react-navigation/native';

const Start = (props) => {
  const {navigation, route} = props;
  const {state, dispatch} = useContext(store);
  const {applicant, dogs, choices, activeDog} = state;

  const [stateChoices, setStateChoices] = useState(choices);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const toggleDog = async (value, dog) => {
    let choice = stateChoices.find((c) => {
      if (c.dogId === dog.id && c.applicantId === applicant.id) return c;
    });

    let updatedItem;
    if (choice) {
      // update
      let payload = {...choice, liked: value};
      delete payload.applicant;
      delete payload.dog;
      delete payload.createdAt;
      delete payload.updatedAt;
      let {data} = await API.graphql({
        query: mutations.updateChoice,
        variables: {
          input: payload,
        },
      });
      updatedItem = data.updateChoice;
      console.log('UPDATED', updatedItem);
      const index = stateChoices.findIndex((x) => x.id === updatedItem.id);
      console.log('find index of choice', index, stateChoices);
      let updatedArray = [...stateChoices];
      if (typeof index === 'number') {
        updatedArray[index] = updatedItem;
        setStateChoices(updatedArray);
      } else {
        setStateChoices(updatedArray);
      }
    } else {
      // create choice
      let {data} = await API.graphql({
        query: mutations.createChoice,
        variables: {
          input: {
            liked: value,
            dogId: dog.id,
            applicantId: applicant.id,
          },
        },
      });
      updatedItem = data.createChoice;

      let items = [...stateChoices, updatedItem];

      setStateChoices(items);
    }
  };

  const navigateDogDetail = (dog) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Detail',
        params: {
          dog: dog,
          title: dog.titel,
        },
      }),
    );
  };

  if (!dogs.length) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  return (
    <ScrollView style={{flex: 1}}>
      <SafeAreaView style={styles.dogsContainer}>
        {dogs
          .filter((dog) => {
            return (
              dog.status !== 'in optie' &&
              dog.status !== 'gereserveerd' &&
              dog.status !== 'geadopteerd'
            );
          })
          .sort(function (a, b) {
            var textA = a.titel.toUpperCase();
            var textB = b.titel.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map((d, i) => {
            let value;
            let choice = stateChoices.find((c) => {
              if (c.dogId === d.id && c.applicantId === applicant.id) return c;
            });
            if (choice) value = choice.liked;
            return (
              <View style={styles.cardContainer} key={`dog-${i}`}>
                <Card>
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{flex: 1}}>
                      <Card.Title title={d.titel} subtitle={d.type} />
                    </View>
                    {d.status && d.status.length ? (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          backgroundColor:
                            d.status && d.status !== 'nieuw!'
                              ? 'tomato'
                              : 'seagreen',
                          height: 30,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{fontWeight: '500', color: 'white'}}>
                          {d.status.toUpperCase()}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Card.Cover
                    source={{uri: `https://wereldhonden.nl${d.fotos[0]}`}}
                  />
                  <Card.Actions>
                    <View style={{marginLeft: 12}}>
                      <Switch
                        disabled={
                          d.status === 'in optie' || d.status === 'gereserveerd'
                        }
                        trackColor={{false: '#767577', true: 'seagreen'}}
                        thumbColor={value ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(newValue) => toggleDog(newValue, d)}
                        value={value}
                      />
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}></View>
                    <Button
                      icon={() => (
                        <Icon name="arrow-right" size={14} color="black" />
                      )}
                      mode="text"
                      contentStyle={{
                        height: 80,
                        width: 80,
                      }}
                      onPress={() => navigateDogDetail(d)}
                    />
                  </Card.Actions>
                </Card>
              </View>
            );
          })}
      </SafeAreaView>
    </ScrollView>
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
