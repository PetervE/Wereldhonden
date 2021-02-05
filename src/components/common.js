import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Title, Divider, ActivityIndicator} from 'react-native-paper';

export const Centered = ({children}) => {
  return <View style={styles.centered}>{children}</View>;
};

export const Loader = () => {
  return <ActivityIndicator animating={true} color={'black'} />;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
