import React, { createContext, useContext, useReducer } from 'react';

const initialKeyState = {
  // keyTimeList: [],
  userId: '',
  trainCount: 1,
  inputRef: {},
  keyDownList: [],
  keyUpList: [],
};

const keyStateReducer = (state, action) => {
  const { userId, trainCount, inputRef, keyUpList, keyDownList } = state;
  switch (action.type) {
    // case 'FIRST_KEY_DOWN':
    //   return {
    //     keyTimeList: keyTimeList,
    //     userId: userId,
    //     trainCount: trainCount,
    //     inputRef: inputRef,
    //     keyDownList: [...keyDownList, action.keyDownList],
    //     keyUpList: keyUpList,
    //   };
    case 'SET_REF':
      return {
        // keyTimeList: keyTimeList,
        userId: userId,
        trainCount: trainCount,
        inputRef: action.inputRef,
        keyDownList: keyDownList,
        keyUpList: keyUpList,
      };
    case 'KEY_DOWN':
      return {
        // keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: [...keyDownList, action.keyDownList],
        keyUpList: keyUpList,
      };
    case 'KEY_UP':
      return {
        // keyTimeList: [...keyTimeList, ...action.newKeyTime],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: keyDownList,
        keyUpList: [...keyUpList, action.keyUpList],
      };
    case 'TYPE_USER_ID':
      return {
        // keyTimeList: keyTimeList,
        userId: userId === action.userId ? userId : action.userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: keyDownList,
        keyUpList: keyUpList,
      };
    case 'BACKSPACE':
      return {
        // keyTimeList: [],
        userId: userId,
        trainCount: trainCount,
        inputRef: inputRef,
        keyDownList: [],
        keyUpList: [],
      };
    case 'REGISTER':
      return {
        // keyTimeList: [],
        userId: userId,
        trainCount: action.trainCount,
        inputRef: inputRef,
        keyDownList: [],
        keyUpList: [],
      };
    case 'SUBMIT':
      return {
        // keyTimeList: [],
        userId: '',
        trainCount: 1,
        inputRef: {},
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
