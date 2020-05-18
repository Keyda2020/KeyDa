import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  keyTimeList: [],
  userId: '',
};

const keyStateReducer = (state, action) => {
  console.log(action.type);
  console.log(state);
  const { keyTimeList, userId } = state;
  switch (action.type) {
    case 'KEY_DOWN':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: state.userId,
      };
    case 'KEY_UP':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: state.userId,
      };
    case 'TYPE_USER_ID':
      return {
        keyTimeList: state.keyTimeList,
        userId: action.userId,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const keyStateContext = createContext();
const keyStateDispatchContext = createContext();

export const KeyStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(keyStateReducer, initialKeyState);

  return (
    <keyStateContext.Provider value={state}>
      <keyStateDispatchContext.Provider value={dispatch}>
        {children}
      </keyStateDispatchContext.Provider>
    </keyStateContext.Provider>
  );
};

export const useKeyStateState = () => {
  const context = useContext(keyStateContext);
  if (!context) {
    throw new Error('Cannot find keyStateProvider');
  }
  return context;
};

export const useKeyStateDispatch = () => {
  const context = useContext(keyStateDispatchContext);
  if (!context) {
    throw new Error('Cannot find keyStateProvider');
  }
  return context;
};
