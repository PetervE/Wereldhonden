import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
} from 'react-native';
import {withTheme, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Amplify, {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import Start from './screens/Start';

import {store, StateProvider, initialState} from './store.js';

const Stack = createStackNavigator();

const Navigation = (props) => {
  const {theme, navigation} = props;

  const {state} = useContext(store);
  const {dogs} = state;

  useEffect(() => {
    init();
    // scrape(s);
  }, []);

  const init = async () => {
    try {
      const {data} = await API.graphql({
        query: queries.listDogs,
        variables: {},
      });
      if (!data) return console.log('Error scrape: no data');
      const items = data.listDogs.items.reduce((memo, item) => {
        if (item.status !== 'geadopteerd') memo.push(item);
        return memo;
      }, []);
      console.log(items);
    } catch (e) {
      console.log('Error scrape', e);
    }
  };

  const scrape = async () => {
    try {
      const result = await API.get('restapi', '/scraper', {
        timeout: 60000,
      });
      console.log('scrape', result);
      if (!result || !result.length)
        return console.log('Error scrape: no data');

      const {data} = await API.graphql({
        query: queries.listDogs,
        variables: {},
      });
      console.log('graphql', data);
      const items = data.listDogs.items || [];

      result.reduce((memo, dog) => {
        const find = items.find((i) => {
          if (
            i.titel === dog.titel &&
            i.land_van_herkomst === dog.land_van_herkomst
          ) {
            return i;
          }
        });
        if (find) {
          if (find.status.length && find.status !== dog.status) {
            dogUpdate(dog, find);
          }
        } else {
          insertDog(dog);
        }
      }, []);
    } catch (e) {
      console.log('Error scrape', e);
    }
  };

  const dogUpdate = async (dog, item) => {
    delete item.createdAt;
    delete item.updatedAt;
    let operation = await API.graphql({
      query: mutations.updateDog,
      variables: {
        input: {
          ...item,
          status:
            typeof dog.status === 'string' && item.status !== dog.status
              ? dog.status
              : '',
        },
      },
    });
    console.log('dog updated', operation);
  };

  const insertDog = async (dog) => {
    let operation = await API.graphql({
      query: mutations.createDog,
      variables: {
        input: {
          titel: dog.titel || '',
          status: typeof dog.status === 'string' ? dog.status : '',
          geslacht: dog.geslacht || '',
          gesteriliseerd: dog.gesteriliseerd || '',
          gecastreerd: dog.gecastreerd || '',
          huidige_verblijfplaats: dog.huidige_verblijfplaats || '',
          land_van_herkomst: dog.land_van_herkomst || '',
          leeftijd: dog.leeftijd || '',
          type: dog.type || '',
          schofthoogte: dog.schofthoogte || '',
          vergoeding: dog.vergoeding || '',
          bijzonderheden: dog.bijzonderheden || '',
          opmerking: dog.opmerking || '',
          verhaal: dog.verhaal || '',
          karakter: dog.karakter || '',
          fotos: dog.fotos && dog.fotos.length ? JSON.stringify(dog.fotos) : '',
          videos:
            dog.videos && dog.videos.length ? JSON.stringify(dog.videos) : '',
        },
      },
    });
    console.log('operation create dog', operation);
  };

  return (
    <View style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          headerMode="float"
          screenOptions={
            {
              // headerStyle: {backgroundColor: 'red'},
              // headerTintColor: '#fff',
              // headerTitleStyle: {
              //   fontWeight: 'bold',
              // },
            }
          }>
          <Stack.Screen
            name="Start"
            component={Start}
            options={{title: `start`, headerShown: true}}
            initialParams={{theme: theme}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default withTheme(Navigation);
