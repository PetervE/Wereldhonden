import React, {
  useReducer,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  StyleSheet,
  LogBox,
  ImageBackground,
  ScrollView,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  AppState,
} from 'react-native';
import {Button, Title, Divider} from 'react-native-paper';
import YoutubePlayer from 'react-native-youtube-iframe';
import {Loader, Centered} from '../components/common';
import {windowWidth, windowHeight} from '../components/device';
import Carousel from 'react-native-snap-carousel';

import {store, initialState} from '../store.js';

import Amplify, {
  Auth,
  API,
  graphqlOperation,
  DataStore,
  Hub,
  SortDirection,
  Predicates,
} from 'aws-amplify';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

const Detail = (props) => {
  const {navigation, route} = props;
  const {state, dispatch} = useContext(store);
  const {applicant, dogs, choices} = state;

  const [activeDog, setActiveDog] = useState(false);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('detail dog', props.route.params.dog);
    let active = props.route.params.dog || false;
    setActiveDog(active);
    return () => {
      setActiveDog(false);
    };
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View>
        <ImageBackground
          source={{uri: `https://wereldhonden.nl${item}`}}
          style={{
            height: 400,
          }}
        />
      </View>
    );
  };

  const renderVideo = ({item}) => {
    let id = item.split('/')[2].split('?')[0];
    console.log('s1', id);

    return (
      <View>
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={id}
          onChangeState={onStateChange}
        />
        <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
      </View>
    );
  };

  if (!activeDog) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={{textAlign: 'center'}}>{activeDog.titel}</Title>

      <Carousel
        layout={'default'}
        data={activeDog.fotos}
        sliderWidth={windowWidth}
        itemWidth={windowWidth - 60}
        renderItem={renderItem}
        // onSnapToItem={(index) => console.log(index)}
      />

      <Carousel
        layout={'default'}
        data={activeDog.videos}
        sliderWidth={windowWidth}
        itemWidth={windowWidth - 60}
        renderItem={renderVideo}
        // onSnapToItem={(index) => console.log(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Detail;
