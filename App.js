import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {API} from 'aws-amplify';

const App = () => {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const result = await API.get('restapi', '/scraper');
    console.log(result);
  };

  return (
    <View style={styles.centered}>
      <Text>Hallo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
