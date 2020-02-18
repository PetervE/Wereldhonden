
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StoreProvider } from 'easy-peasy';
import Button from 'react-native-button';
import store from './store';

import JourneyScreen from './screens/Journey';
import MapScreen from './screens/Map';
import SettingsScreen from './screens/Settings';
import ModalScreen from './screens/Modal';

import JourneyIcon from './images/journey.svg';
import MapIcon from './images/map.svg';
import SettingsIcon from './images/settings.svg';
import JourneyIconGrey from './images/journey-grey.svg';
import MapIconGrey from './images/map-grey.svg';
import SettingsIconGrey from './images/settings-grey.svg';

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  TabBarIconStyles: {
    paddingVertical: 16, width: 30, height: 30, justifyContent: 'center', alignItems: 'center'
  }
});

const MainStackScreen = (props) => {
  return (
    <Tab.Navigator
    tabBarOptions={{
      style: {
        paddingTop: 4,
        minHeight: 60
      }
    }}
    screenOptions={({ route }) => ({
      tabBarLabel: ({ focused, color, size }) => {
        let name;
        switch(route.name) {
          case 'Journey':
          name = 'Journeys';
          break;
          default:
          name = route.name;
          break;
        }
        return (<Text style={{ 
          color: focused ? '#222222' : '#cccccc',
          fontFamily: focused ? 'Roboto-Bold' : 'Roboto-Light',
          textTransform: 'uppercase',
          fontSize: 10,
          paddingBottom: 8
        }}>
          {name}
        </Text>)
      },
      tabBarIcon: ({ focused, color, size }) => {
        switch(route.name) {
          case 'Journey':
            if(focused) return <View style={styles.TabBarIconStyles}><JourneyIcon width={18} height={18} /></View>
            return <View style={styles.TabBarIconStyles}><JourneyIconGrey width={18} height={18} /></View>
          case 'Map':
            if(focused) return <View style={styles.TabBarIconStyles}><MapIcon width={18} height={18} /></View>
            return <View style={styles.TabBarIconStyles}><MapIconGrey width={18} height={18} /></View>
          case 'Settings':
            if(focused) return <View style={styles.TabBarIconStyles}><SettingsIcon width={18} height={18} /></View>
            return <View style={styles.TabBarIconStyles}><SettingsIconGrey width={18} height={18} /></View>
          default: return null
        }
      },
    })}
    >
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
const App = () => {  

  useEffect(() => {
    console.disableYellowBox = true;
  }, []);

  return (
    <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <StoreProvider store={store}>
        <NavigationContainer>
            <RootStack.Navigator 
              mode="modal" 
              headerMode="none"
            >
              <RootStack.Screen name="Main" component={MainStackScreen} />
              <RootStack.Screen name="Modal" component={ModalScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </View>
  );
}

export default App;