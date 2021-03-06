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
import {
  Button,
  Title,
  Divider,
  Badge,
  DataTable,
  Paragraph,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  const [activeMedia, setActiveMedia] = useState('fotos');

  const onStateChange = useCallback((state) => {
    console.log('state', state);
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
    if (activeMedia === 'fotos') {
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
    }
    if (activeMedia === 'videos') {
      let id = item.split('/')[2].split('?')[0];
      return (
        <View>
          <YoutubePlayer
            height={300}
            play={playing}
            videoId={id}
            // onChangeState={onStateChange}
          />
          <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} />
        </View>
      );
    }
  };

  if (!activeDog) {
    return (
      <Centered>
        <Loader />
      </Centered>
    );
  }

  return (
    <ScrollView
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'stretch',
      }}>
      <View style={{alignItems: 'stretch', paddingBottom: 50}}>
        <View
          style={{
            backgroundColor:
              activeDog.status && activeDog.status !== 'nieuw!'
                ? 'tomato'
                : 'seagreen',
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontWeight: '500', color: 'white'}}>
            {activeDog.status.length
              ? activeDog.status.toUpperCase()
              : 'BESCHIKBAAR'}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Button
            icon={() => <Icon name="camera" size={18} color="#222222" />}
            mode="text"
            style={{
              marginVertical: 8,
            }}
            labelStyle={{
              color: '#222222',
              textDecorationLine:
                activeMedia === 'fotos' ? 'underline' : 'none',
            }}
            contentStyle={{
              height: 50,
              paddingHorizontal: 12,
            }}
            onPress={() => setActiveMedia('fotos')}>
            Photos
          </Button>
          <Button
            icon={() => <Icon name="video-camera" size={18} color="#222222" />}
            mode="text"
            style={{
              marginVertical: 8,
            }}
            labelStyle={{
              color: '#222222',
              textDecorationLine:
                activeMedia === 'videos' ? 'underline' : 'none',
            }}
            contentStyle={{
              height: 50,
              paddingHorizontal: 12,
            }}
            onPress={() => setActiveMedia('videos')}>
            Videos
          </Button>
        </View>

        <View>
          <View style={{zIndex: 2}}>
            <Carousel
              layout={'stack'}
              data={activeDog[activeMedia]}
              sliderWidth={windowWidth}
              itemWidth={windowWidth - 20}
              renderItem={renderItem}
              // onSnapToItem={(index) => console.log('fotos', index)}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              zIndex: 1,
              height: '100%',
              justifyContent: 'center',
              paddingBottom: 80,
              alignItems: 'center',
            }}>
            <Loader />
          </View>
        </View>

        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>Geslacht</DataTable.Cell>
            <DataTable.Cell numeric>{activeDog.geslacht}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Type</DataTable.Cell>
            <DataTable.Cell numeric>{activeDog.type}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Leeftijd</DataTable.Cell>
            <DataTable.Cell numeric>{activeDog.leeftijd}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Schofthoogte</DataTable.Cell>
            <DataTable.Cell numeric>{activeDog.schofthoogte}</DataTable.Cell>
          </DataTable.Row>

          {activeDog.gecastreerd ? (
            <DataTable.Row>
              <DataTable.Cell>Gecastreerd</DataTable.Cell>
              <DataTable.Cell numeric>
                {String(activeDog.gecastreerd)}
              </DataTable.Cell>
            </DataTable.Row>
          ) : null}

          {activeDog.gesteriliseerd ? (
            <DataTable.Row>
              <DataTable.Cell>Gesteriliseerd</DataTable.Cell>
              <DataTable.Cell numeric>
                {String(activeDog.gesteriliseerd)}
              </DataTable.Cell>
            </DataTable.Row>
          ) : null}

          {activeDog.land_van_herkomst ? (
            <DataTable.Row>
              <DataTable.Cell>Land van Herkomst</DataTable.Cell>
              <DataTable.Cell numeric>
                {String(activeDog.land_van_herkomst)}
              </DataTable.Cell>
            </DataTable.Row>
          ) : null}

          {activeDog.huidige_verblijfplaats ? (
            <DataTable.Row>
              <DataTable.Cell>Huidige verblijfplaats</DataTable.Cell>
              <DataTable.Cell numeric>
                {String(activeDog.huidige_verblijfplaats)}
              </DataTable.Cell>
            </DataTable.Row>
          ) : null}

          {activeDog.vergoeding ? (
            <DataTable.Row>
              <DataTable.Cell>Vergoeding</DataTable.Cell>
              <DataTable.Cell numeric>
                €{String(activeDog.vergoeding)},-
              </DataTable.Cell>
            </DataTable.Row>
          ) : null}

          {activeDog.bijzonderheden ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: 'stretch',
              }}>
              <Title>Bijzonderheden</Title>
              <Paragraph
                style={{
                  lineHeight: 28,
                }}>
                {activeDog.bijzonderheden}
              </Paragraph>
            </View>
          ) : null}

          {activeDog.opmerking ? (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: 'stretch',
              }}>
              <Title>Opmerking</Title>
              <Paragraph
                style={{
                  lineHeight: 28,
                }}>
                {activeDog.opmerking}
              </Paragraph>
            </View>
          ) : null}

          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignItems: 'stretch',
            }}>
            <Title>Het verhaal van {activeDog.titel}</Title>
            <Paragraph
              style={{
                lineHeight: 28,
              }}>
              {activeDog.verhaal}
            </Paragraph>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}>
            <Title>Het karakter van {activeDog.titel}</Title>
            <Paragraph
              style={{
                lineHeight: 28,
              }}>
              {activeDog.karakter}
            </Paragraph>
          </View>
        </DataTable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Detail;
