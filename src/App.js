import React, {useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {API} from 'aws-amplify';
import * as queries from './graphql/queries';
import {store, StateProvider, initialState} from './store';
import Navigation from './Navigation';

const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: 'white',
    error: '#B00020',
    text: 'black',
    onBackground: '#000000',
    onSurface: '#000000',
  },
  animation: {
    scale: 1.0,
  },
};

const App = () => {
  return (
    <StateProvider>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </StateProvider>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
