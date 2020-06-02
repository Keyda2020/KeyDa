import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  userId: '',
  trainCount: 1,
  inputRef: {},
  keyDownList: [],
  keyUpList: [],
};

const keyStateReducer = (state, action) => {
  const { userId, trainCount, inputRef, keyUpList, keyDownList } = state;
  switch (action.type) {
    case 'CLEAR_PW':
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: [],
        keyUpList: [],
      };
    case 'SET_REF':
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: action.inputRef,
        keyDownList: keyDownList,
        keyUpList: keyUpList,
      };
    case 'KEY_DOWN':
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: [...keyDownList, action.keyDownList],
        keyUpList: keyUpList,
      };
    case 'KEY_UP':
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: keyDownList,
        keyUpList: [...keyUpList, action.keyUpList],
      };
    case 'TYPE_USER_ID':
      return {
        userId: userId === action.userId ? userId : action.userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: keyDownList,
        keyUpList: keyUpList,
      };
    case 'BACKSPACE':
      let keyDownDeleted = keyDownList.slice(0, keyDownList.length - 1);
      let keyUpDeleted = keyUpList.slice(0, keyUpList.length - 1);
      const isInputCleared = inputRef.current.value === '';
      if (isInputCleared) {
        keyDownDeleted = [];
        keyUpDeleted = [];
      }
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: keyDownDeleted,
        keyUpList: keyUpDeleted,
      };
    case 'REGISTER':
      return {
        userId: userId,
        trainCount: action.trainCount,
        inputRef: inputRef,
        keyDownList: [],
        keyUpList: [],
      };
    case 'SUBMIT':
      return {
        userId: '',
        trainCount: 1,
        inputRef: {},
        keyDownList: [],
        keyUpList: [],
      };
    case 'WRONG_TYPING':
      return {
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: [],
        keyUpList: [],
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

export const useKeyStateContext = () => {
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
