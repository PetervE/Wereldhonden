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
import awsconfig from '../aws-exports';
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

import {
  Authenticator,
  Greetings,
  SignIn,
  ConfirmSignIn,
  RequireNewPassword,
  SignUp,
  ConfirmSignUp,
  VerifyContact,
  ForgotPassword,
  TOTPSetup,
  Loading,
} from 'aws-amplify-react-native';
import {Loader, Centered} from '../components/common';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

const Admin = (props) => {
  const {authData} = props;

  const [admin, setAdmin] = useState(authData);

  useEffect(() => {
    console.log('init admin page', props);
    return () => {};
  }, []);

  const scrape = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = await user.signInUserSession.idToken.jwtToken;
      console.log(token);

      return;

      const result = await API.get('restapi', '/scraper', {
        timeout: 60000,
      });
      if (!result || !result.length)
        return console.log('Error scrape: no data');

      const {data} = await API.graphql({
        query: queries.listDogs,
        variables: {},
      });
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

  const signout = async () => {
    await Auth.signOut({global: true});
  };

  const dogUpdate = async (dog, item) => {
    try {
      delete item.createdAt;
      delete item.updatedAt;
      await API.graphql({
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
    } catch (e) {
      console.log('Error dogUpdate', e);
    }
  };

  const insertDog = async (dog) => {
    try {
      await API.graphql({
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
            fotos:
              dog.fotos && dog.fotos.length ? JSON.stringify(dog.fotos) : '',
            videos:
              dog.videos && dog.videos.length ? JSON.stringify(dog.videos) : '',
          },
        },
      });
    } catch (e) {
      console.log('insertDog', e);
    }
  };

  if (!admin) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  return (
    <View style={styles.centered}>
      <Button onPress={signout}>Sign out</Button>
      <Button onPress={scrape}>Click</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});

const MyCustomSignIn = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text>Sign in</Text>
    </View>
  );
};

const AdminApp = (props) => {
  const [authState, setAuthState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    init();
    if (authState === 'signIn' && admin) setAdmin(false);
  }, [authState]);

  const init = async () => {
    try {
      if (admin || loading) return;
      setLoading(true);
      const adminCheck = await Auth.currentAuthenticatedUser();
      console.log('admin', adminCheck);
      if (adminCheck) {
        setAdmin(adminCheck);
      } else {
        setAdmin(false);
      }
      setLoading(false);
    } catch (err) {
      if (admin) setAdmin(false);
      if (loading) setLoading(false);
    }
  };
  return (
    <Authenticator
      authState="signIn"
      authData={admin || {}}
      onStateChange={(status) => {
        setAuthState(status);
      }}
      hideDefault={admin ? true : false}
      amplifyConfig={awsconfig}
      errorMessage={(e) => console.log('error Authenticator', e)}>
      {admin && authState === 'signedIn' && <Admin override={'signedIn'} />}
    </Authenticator>
  );
};

export default AdminApp;
