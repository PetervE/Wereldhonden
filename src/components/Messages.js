import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { dimensions } from '../styles/index';
import { useHeaderHeight } from '@react-navigation/stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useStoreState, useStoreActions } from 'easy-peasy';

const Messages = () => {

	// const { error, message } = store;

  const storage = useStoreState(state => state);
  const { update } = useStoreActions(actions => actions);
	const { error, success, message } = storage;
	
	let width = new Animated.Value(100);
	let duration, bg;
	
	if(error) {
		bg = 'red';
		duration = 10000;
	}
	if(success) {
		bg = 'green';
		duration = 3000;
	}
	if(message) {
		bg = 'grey';
		duration = 5000;
	}
	let timer;
	const setTimer = () => {
    timer = Animated.timing(width, {
      toValue: 0,
      duration: duration,
      easing: Easing.linear,
		}).start(() => exit());
	};

	const exit = () => {
		width.stopAnimation();
		update({ key: 'error', value: null });
		update({ key: 'success', value: null });
		update({ key: 'message', value: null });
	}

  useEffect(() => {
    return () => {
			clearInterval(timer);
		}
  }, []);
	
	if(!error && !message && !success) return null;
	
	setTimer();

	return (<View style={{
		position: 'absolute',
		top: getStatusBarHeight(),
		zIndex: 9,
		left: 0,
		justifyContent: 'flex-end',
		alignItems: 'stretch',
		width: dimensions.width,
		paddingHorizontal: 16,
	}}>
		<View style={{
			backgroundColor: bg,
			flexDirection: 'column',
			position: 'relative'
		}}>
			<Text style={{
				paddingHorizontal: 16,
				paddingVertical: 16,
				color: 'white',
				fontFamily: 'Roboto-Regular',
				fontSize: 22
			}}>{ error || success || message || '' }</Text>
			<Animated.View style={{ 
				height: 5, 
				backgroundColor: 'rgba(0, 0, 0, 0.5)', 
				position: 'absolute', 
				bottom: 0, 
				left: 0, 
        width: width.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }),
			}}>

			</Animated.View>
		</View>
	</View>);

}

export default Messages;