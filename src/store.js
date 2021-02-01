import React, {createContext, useReducer} from 'react';

const initialState = {
  dogs: [],
};

const store = createContext(initialState);

const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    // console.log(action.type, action.payload);
    switch (action.type) {
      case 'SET_USER':
        return {...state, user: action.payload};
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{state, dispatch}}>{children}</Provider>;
};

export {store, StateProvider, initialState};
