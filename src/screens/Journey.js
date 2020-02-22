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
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

const JourneyScreen = ({ navigation }) => {

  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
  const { raw, busy, dogs } = storage;

  const fetchData = async() => {
    try {
      const req = await fetch('https://wereldhonden.nl/hond-adopteren');
      const html = new DOMParser().parseFromString(req._bodyText, 'text/html');
      
      const sections = html.getElementsByAttribute('itemprop', 'blogPost');
      const titles = html.getElementsByTagName('h2');
      const imagesTotal = html.getElementsByAttribute('title');
      const images = Array.prototype.slice.call(imagesTotal).filter(image => {
        if(image == null || !image.firstChild || !image.firstChild.tagName) return;
        if(image.firstChild.tagName !== 'img') return;
        return image;
      });
      const infos = html.getElementsByAttribute('class', 'adop2');
      const infos2 = html.getElementsByAttribute('class', 'adop3');
      
      const list = [];
      Array.from(sections).map((s, index) => { 
        const titleRaw = titles.item(index);
        const imageRaw = images[index];
        const info = infos.item(index).childNodes[1].childNodes;
        const info2 = infos2.item(index).childNodes[1].childNodes;

        if(!titleRaw || !imageRaw || !info || !info2) return;
        
        const title = titleRaw.firstChild.data || titleRaw.firstChild.firstChild.data || '';
        const image = `https://wereldhonden.nl${ imageRaw.attributes[0].value }`;
        const status = title.split(' ')[1] ? title.split(' ')[1].trim().substring(1, title.split(' ')[1].length-1) : 'beschikbaar';
        const gender = info[1].childNodes[3].firstChild.data;
        const type = info[3].childNodes[3].firstChild.data;
        const age = info[5].childNodes[3].firstChild.data;
        const height = info[7].childNodes[3].firstChild.data
        const castrated = info[9].childNodes[3].firstChild.data;
        const origin = info2[1].childNodes[3].firstChild.data;
        const location = info2[3].childNodes[3].firstChild.data;
        const fee = info2[5].childNodes[3].firstChild.data;
        
        list.push({
          id: shortid.generate(),
          name: title.split(' ')[0].trim(),
          status: status,
          image: image,
          gender: gender,
          type: type,
          age: age,
          height: height,
          castrated: castrated,
          origin: origin,
          location: location,
          fee: fee
        });
  
      });

      return list;

    } catch(error) {
      throw(123, error);
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
      <Button onPress={() => listDogs() }>Play game</Button>
    </View>
  );

}

export default JourneyScreen;