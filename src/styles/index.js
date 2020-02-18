import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = { width, height };

export const isAndroid = Platform.OS == 'android';