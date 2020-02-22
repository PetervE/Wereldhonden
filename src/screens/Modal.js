import React, { useEffect, useRef, useCallback } from 'react';
import {  View, Text, ScrollView, Image, KeyboardAvoidingView, TextInput, 
          TouchableWithoutFeedback, Keyboard, StatusBar, SafeAreaView } from 'react-native';
import Button from 'react-native-button';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { isAndroid, DIMENSIONS } from '../styles';
import Loader from '../components/Loader';
import Dog from '../components/Dog';

import ArrowDown from '../images/download.svg';

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
    <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <ScrollView 
      style={{ flex: 1, flexDirection: 'row' }} 
      horizontal
      pagingEnabled={true}
      >
        <View style={{
          flexGrow: 1,
          flexDirection: 'row'
        }}>
        {
          dogs.map((d, i) => {
            return (
              <ScrollView 
              key={`dog-${i}`}
              contentContainerStyle={{
                height: '100%',
                backgroundColor: 'white',
                width: DIMENSIONS.width,
                alignItems: 'stretch'
              }}
              >
                <Dog d={d} i={i} length={dogs.length} />
              </ScrollView>
            );
          })
        }
        </View>
      </ScrollView>
      <View style={{ backgroundColor: 'white', alignItems: 'stretch', borderTopColor: '#ccc', borderTopWidth: 1 }}>
        <Button 
          containerStyle={{
            height: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          style={{ 
            fontFamily: 'Roboto-Thin',
            color: '#222',
            paddingVertical: 16,
          }} onPress={() => navigation.goBack() }>
            <ArrowDown width={20} height={20} />
          </Button>
          <SafeAreaView />
      </View>
    </View>
  );

};

export default ModalScreen;