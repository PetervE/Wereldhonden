import React, { useRef, useEffect, useCallback, memo } from 'react';
import { Keyboard, ScrollView, Image,
  View, Text, TouchableOpacity, StyleSheet, TextInput, 
  StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Button from 'react-native-button';
import { isAndroid, DIMENSIONS } from '../styles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Loader from '../components/Loader';
import shortid from 'shortid';

import { DOMParser } from 'react-native-html-parser';

import Messages from '../components/Messages';

const JourneyScreen = ({ navigation }) => {

  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
  const { raw, busy, dogs } = storage;

  const fetchData = async() => {
    try {
      const req = await fetch('https://wereldhonden.nl/hond-adopteren');
      const html = new DOMParser().parseFromString(req._bodyText, 'text/html');
      const sections = html.getElementsByAttribute('itemprop', 'blogPost');
  
      let list = [];
      Array.from(sections).map(s => { // map over sections and extract data
        const body = s.childNodes[3].childNodes[1].childNodes[1].childNodes[1];
        const info = body.childNodes[body.childNodes[3].tagName == 'br' ? 5 : 3].childNodes[1];
        const info2 = body.childNodes[body.childNodes[3].tagName == 'br' ? 7 : 5].childNodes[1];

        const nameRaw = s.childNodes[1].data || s.childNodes[1].firstChild.data || s.childNodes[1].firstChild.firstChild.data || '';
        const name = nameRaw.split(' ');
        const image = body.childNodes[1].childNodes[1].childNodes[1].childNodes[1].firstChild.attributes[0];
        const gender = info.childNodes[3].childNodes[3].firstChild;
        const type = info.childNodes[3].childNodes[3].firstChild;
        const age = info.childNodes[5].childNodes[3].firstChild;
        const height = info.childNodes[7].childNodes[3].firstChild;
        const castrated = info.childNodes[9].childNodes[3].firstChild;
        const origin = info2.childNodes[1].childNodes[3].firstChild;
        const location = info2.childNodes[3].childNodes[3].firstChild;
        const fee = info2.childNodes[5].childNodes[3].firstChild;

        list.push({
          id: shortid.generate(),
          name: name[0].trim(),
          status: name[1] ? name[1].trim().substring(1, name[1].length-1) : 'beschikbaar',
          image: `https://wereldhonden.nl${ image.value }`,
          gender: gender.data,
          type: type.data,
          age: age.data,
          height: height.data,
          castrated: castrated.data,
          origin: origin.data,
          location: location.data,
          fee: fee.data
        });
      });
      return list;

    } catch(error) {
      throw(error);
    }
  }

  const listDogs = async() => {
    if(!dogs || !dogs.length) {
      update({ key: 'busy', value: true });
      const list = await fetchData();
      update({ key: 'dogs', value: list });
    }
    navigation.navigate('Modal');
  }

  if(busy) return (
  <View style={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}>
    <Loader />
  </View>
  );

  return (
    <View style={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}>
      <Button onPress={() => listDogs() }>List dogs</Button>
    </View>
  );

}

export default JourneyScreen;