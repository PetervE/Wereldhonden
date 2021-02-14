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
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withTheme, Button} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef, isReadyRef} from './RootNavigation';

import Amplify, {API, graphqlOperation} from 'aws-amplify';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

import {Loader, Centered} from './components/common';

import Start from './screens/Start';
import Profile from './screens/Profile';
import Admin from './screens/Admin';
import Detail from './screens/Detail';

import {store, StateProvider, initialState} from './store.js';
import {sub} from 'react-native-reanimated';

const Stack = createStackNavigator();

const Navigation = (props) => {
  const {theme, navigation} = props;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const {state, dispatch} = useContext(store);
  const {applicant, dogs, choices} = state;
  const [loading, setLoading] = useState(false);

  let subscription;
  const listen = () => {
    subscription = API.graphql(
      graphqlOperation(subscriptions.onCreateUpdate),
    ).subscribe({
      next: ({
        value: {
          data: {onCreateUpdate},
        },
      }) => {
        console.log('update', onCreateUpdate);
        getDogs();
      },
    });
    AppState.addEventListener('change', _handleAppStateChange);
    getDogs();
  };

  const unlisten = () => {
    AppState.removeEventListener('change', _handleAppStateChange);
    isReadyRef.current = false;
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };

  useEffect(() => {
    init(); // get user first
    return () => {
      unlisten();
    };
  }, []);

  useEffect(() => {
    if (applicant && applicant.id) listen(); // listen to updates and get data when user in state
  }, [applicant]);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      init();
    }
    if (
      appState.current == 'active' &&
      (nextAppState === 'inactive' || nextAppState === 'background')
    ) {
      unlisten();
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  const createUser = async () => {
    const {data} = await API.graphql({
      query: mutations.createApplicant,
      variables: {input: {}},
    });
    await AsyncStorage.setItem('@user', data.createApplicant.id);
    dispatch({
      type: 'SET_APPLICANT',
      payload: data.createApplicant,
    });
  };

  const init = async () => {
    setLoading(true);
    const value = await AsyncStorage.getItem('@user');
    if (value) {
      // get user
      const {
        data: {getApplicant},
      } = await API.graphql({
        query: queries.getApplicant,
        variables: {id: value},
      });
      if (getApplicant) {
        console.log('user', getApplicant);
        dispatch({type: 'SET_APPLICANT', payload: getApplicant});
      } else {
        createUser();
      }
    } else {
      createUser();
    }
  };

  const getDogs = async () => {
    const {
      data: {listDogs},
    } = await API.graphql({
      query: queries.listDogs,
      variables: {},
    });
    if (!listDogs) return console.log('Error scrape: no data');
    const items = listDogs.items.reduce((memo, item) => {
      if (item.status !== 'geadopteerd') {
        memo.push({
          ...item,
          fotos: item.fotos ? JSON.parse(item.fotos) : false,
          videos: item.videos ? JSON.parse(item.videos) : false,
        });
      }
      return memo;
    }, []);
    // console.log('dogs', dogs);
    dispatch({type: 'SET_DOGS', payload: items});
    getChoices();
  };

  const getChoices = async () => {
    const {
      data: {choicesByApplicant},
    } = await API.graphql({
      query: queries.choicesByApplicant,
      variables: {applicantId: applicant.id},
    });
    // console.log('choices', choicesByApplicant.items);
    dispatch({type: 'SET_CHOICES', payload: choicesByApplicant.items});
    if (loading) setLoading(false);
  };

  if (loading) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  const Tab = createBottomTabNavigator();

  function TabStack() {
    return (
      <Tab.Navigator
        initialRouteName="Start"
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
        screenOptions={({route}) => {
          return {
            tabBarIcon: ({focused, color, size}) => {
              if (route.name === 'Start') {
                return <Icon name="rocket" size={18} color="black" />;
              } else if (route.name === 'Profile') {
                return <Icon name="user" size={18} color="black" />;
              } else if (route.name === 'Admin') {
                return <Icon name="stop" size={18} color="black" />;
              }
            },
          };
        }}>
        <Tab.Screen
          name="Start"
          component={Start}
          options={{title: `start`}}
          initialParams={{theme: theme}}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{title: `profile`}}
          initialParams={{theme: theme}}
        />
        <Tab.Screen
          name="Admin"
          component={Admin}
          options={{title: `admin`}}
          initialParams={{theme: theme}}
        />
      </Tab.Navigator>
    );
  }

  return (
    <View style={{flex: 1}}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{headerShown: false}}
            name="Home"
            component={TabStack}
          />
          <Stack.Screen
            options={({route}) => ({
              headerShown: true,
              title: route.params.title || 'Detail',
              headerLeft: () => (
                <Button
                  contentStyle={{height: 50, width: 50}}
                  onPress={() => navigationRef.current?.goBack()}>
                  <Icon name="arrow-left" size={14} color="#222222" />
                </Button>
              ),
            })}
            name="Detail"
            component={Detail}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default withTheme(Navigation);
