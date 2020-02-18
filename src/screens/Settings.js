import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Button from 'react-native-button';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../images/logo.svg';
import { isAndroid } from '../styles';
import AppStore from '../images/app-store.svg';
import GooglePlay from '../images/google-play.svg';

const SettingsScreen = ({ navigation }) => {
  
  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
  const { journeys, showcase } = storage;

  useEffect(() => {
  }, []);

	return (
    <View style={{
      flexGrow: 1,
      alignItems: 'center',
      justifyContent:'center'
     }}>
     <Text>Settings</Text>
   </View>
	);
}

export default SettingsScreen;