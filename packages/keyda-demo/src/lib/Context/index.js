import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  keyTimeList: [],
  userId: '',
};

const keyStateReducer = (state, action) => {
  const { keyTimeList, userId } = state;
  switch (action.type) {
    case 'KEY_DOWN':
      console.log(action.type, state.keyTimeList);
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: state.userId,
      };
    case 'KEY_UP':
      console.log(action.type, state.keyTimeList);
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: state.userId,
      };
    case 'TYPE_USER_ID':
      return {
        keyTimeList: state.keyTimeList,
        userId: userId === action.userId ? userId : action.userId,
      };
    case 'BACKSPACE':
      return {
        keyTimeList: [],
        userId: userId,
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
