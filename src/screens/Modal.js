import React, { useEffect, useRef, useCallback } from 'react';
import {  View, Text, ScrollView, Image, KeyboardAvoidingView, TextInput, 
          TouchableWithoutFeedback, Keyboard, StatusBar, SafeAreaView } from 'react-native';
import Button from 'react-native-button';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { isAndroid, DIMENSIONS } from '../styles';
import Loader from '../components/Loader';

import Messages from '../components/Messages';

const ModalScreen = ({ navigation }) => {
  
  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
  const { dogs } = storage;

  if(!dogs || !dogs.length) return (<Loader />);

  useEffect(() => {
    update({ key: 'busy', value: false });
  }, []);

  return (
    <View style={{ flexGrow: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{
          flexGrow: 1
        }}>
        {
          dogs.map((d, i) => {
            return (
              <View key={`dog-${i}`}>
                <Image source={{ uri: d.image }} style={{ width: DIMENSIONS.width, height: (DIMENSIONS.width / 4) * 3}} />
                <Text>{ d.name }</Text>
              </View>
            );
          })
        }
        </View>
      </ScrollView>
      <View style={{ backgroundColor: 'white', alignItems: 'stretch' }}>
        <SafeAreaView style={{ flexGrow: 1, alignItems: 'stretch' }}>
          <Button style={{ 
            height: 100, 
            paddingVertical: 16,
          }} onPress={() => navigation.goBack() }>Back</Button>
        </SafeAreaView>
      </View>
    </View>
  );

};

export default ModalScreen;