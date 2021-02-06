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
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, Title, Divider, Card, TextInput} from 'react-native-paper';

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
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const Profile = (props) => {
  const {navigation, route} = props;
  const {state, dispatch} = useContext(store);
  const {applicant, dogs, choices} = state;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [stateChoices, setStateChoices] = useState([]);

  const [name, setName] = useState(applicant.name || '');
  const [email, setEmail] = useState(applicant.email || '');
  const [phone, setPhone] = useState(applicant.phone || '');

  useEffect(() => {
    if (isFocused === true) init();
    return () => {
      setLoading(true);
    };
  }, [isFocused]);

  const init = async () => {
    const {
      data: {choicesByApplicant},
    } = await API.graphql({
      query: queries.choicesByApplicant,
      variables: {applicantId: applicant.id},
    });
    // console.log('choices', choicesByApplicant.items);
    setStateChoices(choicesByApplicant.items);
    setLoading(false);
  };

  const saveApplicant = async () => {
    setLoading(true);
    let payload = {...applicant, name, email, phone};
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.choices;

    await API.graphql({
      query: mutations.updateApplicant,
      variables: {
        input: payload,
      },
    });
    setLoading(false);
  };

  const likedDogs = stateChoices.reduce((memo, choice) => {
    const find = dogs.find((d) => d.id === choice.dogId);
    if (find && choice.liked === true) memo.push(find);
    return memo;
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.formContainer}>
        <SafeAreaView>
          <TextInput
            style={styles.inputStyle}
            label="Name"
            value={name}
            onChangeText={(text) => setName(String(text))}
          />
          <TextInput
            style={styles.inputStyle}
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(String(text))}
          />
          <TextInput
            style={styles.inputStyle}
            label="Phone number"
            value={phone}
            onChangeText={(text) => setPhone(String(text))}
          />
          <View style={{alignItems: 'center'}}>
            <Button
              disabled={loading || !name || !email || !phone}
              icon={() => <Icon name="save" size={18} color="white" />}
              mode="contained"
              style={{
                marginVertical: 8,
              }}
              contentStyle={{
                height: 50,
                backgroundColor: 'tomato',
                paddingHorizontal: 12,
              }}
              onPress={saveApplicant}>
              Save
            </Button>
          </View>
        </SafeAreaView>
      </View>
      {likedDogs.length !== 0 ? (
        <Title style={{paddingHorizontal: 16, textAlign: 'center'}}>
          {likedDogs.length > 1
            ? `${likedDogs.length} dogs`
            : `${likedDogs.length} dog`}
        </Title>
      ) : null}
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
  formContainer: {
    backgroundColor: '#222222',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  inputStyle: {
    marginVertical: 8,
  },
});

export default Profile;
