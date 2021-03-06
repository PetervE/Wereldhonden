import React, {createContext, useReducer} from 'react';

const initialState = {
  applicant: false,
  dogs: [],
  choices: [],
};

const store = createContext(initialState);

const {Provider} = store;

const StateProvider = ({children}) => {
  const [state, dispatch] = useReducer((state, action) => {
    // console.log(action.type, action.payload);
    switch (action.type) {
      case 'SET_APPLICANT':
        return {...state, applicant: action.payload};

      case 'SET_DOGS':
        return {...state, dogs: action.payload};

      case 'SET_CHOICES':
        return {...state, choices: action.payload};

      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{state, dispatch}}>{children}</Provider>;
};

export {store, StateProvider, initialState};
