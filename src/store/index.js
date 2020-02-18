import { createStore, action } from 'easy-peasy';
import { Platform } from 'react-native';

const store = createStore({
	// data
	busy: false,
	dogs: false,
	// mutations
	update: action((state, payload) => {
		state[payload.key] = payload.value;
		console.log(`store change: ${ payload.key }: `, state[payload.key]);
	})
});

export default store;