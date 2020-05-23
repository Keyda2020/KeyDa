import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  keyTimeList: [],
  userId: '',
  trainCount: 0,
  inputRef: {},
};

const keyStateReducer = (state, action) => {
  const { keyTimeList, userId, trainCount, inputRef } = state;
  switch (action.type) {
    case 'SET_REF':
      console.log(state, action);
      return {
        keyTimeList: keyTimeList,
        userId: userId,
        trainCount: trainCount,
        inputRef: action.inputRef,
      };
    case 'KEY_DOWN':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
      };
    case 'KEY_UP':
      return {
        keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
      };
    case 'TYPE_USER_ID':
      return {
        keyTimeList: keyTimeList,
        userId: userId === action.userId ? userId : action.userId,
        trainCount: trainCount,
        inputRef: inputRef,
      };
    case 'BACKSPACE':
      return {
        keyTimeList: [],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
      };
    case 'REGISTER':
      return {
        keyTimeList: [],
        userId: '',
        trainCount: action.trainCount,
        inputRef: inputRef,
      };
    case 'SUBMIT':
      return {
        keyTimeList: [],
        userId: '',
        trainCount: 0,
        inputRef: {},
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
