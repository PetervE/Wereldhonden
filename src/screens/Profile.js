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
import {
  Button,
  Title,
  List,
  Divider,
  Card,
  TextInput,
  Paragraph,
} from 'react-native-paper';

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

  const [expanded, setExpanded] = useState(false);
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

    const {
      data: {updateApplicant},
    } = await API.graphql({
      query: mutations.updateApplicant,
      variables: {
        input: payload,
      },
    });
    setLoading(false);
    setExpanded(false);
    dispatch({type: 'SET_APPLICANT', payload: updateApplicant});
  };

  const likedDogs = stateChoices.reduce((memo, choice) => {
    const find = dogs.find((d) => d.id === choice.dogId);
    if (find && choice.liked === true) memo.push(find);
    return memo;
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <View>
        <SafeAreaView>
          <Title style={{paddingHorizontal: 20}}>Jouw wereldhonden</Title>
          <Paragraph style={{paddingHorizontal: 20}}>
            Op deze pagina zie je de honden waar je interesse in hebt om
            mogelijk te adopteren.
          </Paragraph>
          <Paragraph style={{paddingHorizontal: 20}}>
            Vul je gegevens in om gecontacteerd te worden door Wereldhonden voor
            de vervolgstappen.
          </Paragraph>
          <List.Section>
            <List.Accordion
              expanded={expanded}
              onPress={() => setExpanded(!expanded)}
              titleStyle={{
                backgroundColor: '#cccccc',
                color: '#222222',
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontWeight: '500',
              }}
              title={
                applicant && applicant.name ? applicant.name : 'Contactgegevens'
              }>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.inputStyle}
                  label="Naam"
                  value={name}
                  onChangeText={(text) => setName(String(text))}
                />
                <TextInput
                  style={styles.inputStyle}
                  label="E-mail"
                  value={email}
                  onChangeText={(text) => setEmail(String(text))}
                />
                <TextInput
                  style={styles.inputStyle}
                  label="Telefoonnummer"
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
              </View>
            </List.Accordion>
          </List.Section>
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
                {dog.status && dog.status.length ? (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      backgroundColor:
                        dog.status && dog.status !== 'nieuw!'
                          ? 'tomato'
                          : 'seagreen',
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontWeight: '500', color: 'white'}}>
                      {dog.status.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
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
