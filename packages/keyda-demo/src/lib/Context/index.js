import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  keyTimeList: [],
  userId: '',
  trainCount: 0,
};

const keyStateReducer = (state, action) => {
  const { keyTimeList, userId, trainCount } = state;
  switch (action.type) {
    case 'KEY_DOWN':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
      };
    case 'KEY_UP':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
      };
    case 'TYPE_USER_ID':
      return {
        keyTimeList: state.keyTimeList,
        userId: userId === action.userId ? userId : action.userId,
        trainCount: trainCount,
      };
    case 'BACKSPACE':
      return {
        keyTimeList: [],
        userId: userId,
        trainCount: trainCount,
      };
    case 'REGISTER':
      return {
        keyTimeList: keyTimeList,
        userId: userId,
        trainCount: trainCount < 5 ? trainCount + 1 : trainCount,
      };
    case 'SUBMIT':
      return {
        keyTimeList: [],
        userId: '',
        trainCount: 0,
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
