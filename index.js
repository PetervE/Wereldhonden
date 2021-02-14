import 'react-native-gesture-handler';
import {AppRegistry, NativeModules} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports';

// NativeModules.RNCNetInfo = {
//   getCurrentState: jest.fn(() => Promise.resolve()),
//   addListener: jest.fn(),
//   removeListeners: jest.fn(),
// };

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

AppRegistry.registerComponent(appName, () => App);
