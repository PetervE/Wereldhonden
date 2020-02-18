import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { isAndroid, dimensions } from '../styles';

import Messages from '../components/Messages';

const ModalScreen = ({ navigation }) => {

  return (
    <View style={{ justifyContent: 'center' }}>
      <Text>Modal</Text>
    </View>
  );

};

export default ModalScreen;