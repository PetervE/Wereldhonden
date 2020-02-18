import React, { useRef, useEffect, useCallback, memo } from 'react';
import { Keyboard, ScrollView, Image,
  View, Text, TouchableOpacity, StyleSheet, TextInput, 
  StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Button from 'react-native-button';
import { isAndroid, DIMENSIONS } from '../styles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Loader from '../components/Loader';

import { DOMParser } from 'react-native-html-parser';

import Messages from '../components/Messages';

const JourneyScreen = ({ navigation }) => {

  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
  const { raw, busy, dogs } = storage;

  const listDogs = async() => {
    // update({ key: 'busy', value: true })
    const req = await fetch('https://wereldhonden.nl/hond-adopteren');
    const html = new DOMParser().parseFromString(req._bodyText, 'text/html');
    const sections = html.getElementsByAttribute('itemprop', 'blogPost');

    let dogs = [];
    // map over sections and extract data
    Array.from(sections).map(s => {
      const body = s.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1];
      // console.log(body);
      dogs.push({
        name: s.childNodes[1].data || s.childNodes[1].firstChild.data || s.childNodes[1].firstChild.firstChild.data || '',
        image: `https://wereldhonden.nl${ body.childNodes[1].childNodes[1].childNodes[1].firstChild.attributes[0].value }`
      });
    });
    update({ key: 'dogs', value: dogs });
    update({ key: 'busy', value: false });
  }

  if(busy) return (
  <View style={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}>
    <Loader />
  </View>
  );

  if(dogs && dogs.length) return (
    <ScrollView style={{ flexGrow: 1 }}>
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
    <Button onPress={() => listDogs() }>List dogs</Button>
    </ScrollView>
  );

  return (
    <View style={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}>
      <Button onPress={() => listDogs() }>List dogs</Button>
    </View>
  );

}

export default JourneyScreen;