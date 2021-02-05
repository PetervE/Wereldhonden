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
  const {user, dogs} = state;

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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
        <View style={styles.dogsContainer}>
          {dogs.map((d, i) => {
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
                      thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
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
