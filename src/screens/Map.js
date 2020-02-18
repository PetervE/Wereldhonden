import React, { useRef, useEffect, useCallback } from 'react';
import { Keyboard, 
  View, Text, TouchableOpacity, StyleSheet, TextInput, 
  StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Button from 'react-native-button';
import { isAndroid, dimensions } from '../styles';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Messages from '../components/Messages';

const MapScreen = ({ navigation }) => {

  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);

  return (
    <View style={{
      flexGrow: 1,
      alignItems: 'center',
      justifyContent:'center'
     }}>
     <Text>Map</Text>
   </View>
  );

}

export default MapScreen;