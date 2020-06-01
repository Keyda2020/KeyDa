import React, { useState, useCallback, useRef } from 'react';
import _ from 'lodash';

import { useKeyStateContext, useKeyStateDispatch } from '../Context';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;
  // const [lastKeyDown, setLastKeyDown] = useState(0);
  // const [lastKeyUp, setLastKeyUp] = useState(0);
  const isPasswordInput = type === 'password';

  const filteredKey = [
    'Enter',
    'Alt',
    'Backspace',
    'Control',
    'Meta',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'CapsLock',
    ' ', // Space Bar
  ];

  const keyDispatch = useKeyStateDispatch();
  const keyState = useKeyStateContext();
  const inputRef = useRef();

  const handleKeydown = useCallback(
    (e) => {
      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;
        // if (lastKeyDown === 0) {
        //   setLastKeyDown(timeStamp);
        //   keyDispatch({
        //     type: 'FIRST_KEY_DOWN',
        //     downList: timeStamp,
        //   });
        // }
        // if (lastKeyDown > 0 && lastKeyUp > 0) {
        //   const newKeyTimeDD = timeStamp - lastKeyDown;
        //   const newKeyTimeUD = timeStamp - lastKeyUp;
        //   keyDispatch({
        //     type: 'KEY_DOWN',
        //     newKeyTime: [newKeyTimeDD, newKeyTimeUD],
        //     downList: timeStamp,
        //   });
        // }
        // setLastKeyDown(timeStamp);
      }
    },
    [keyDispatch, filteredKey]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (_.isEqual(keyState.inputRef, {})) {
        // inputRef.current.setLastKeyDown = (value) => {
        //   setLastKeyDown(value);
        // };
        // inputRef.current.setLastKeyUp = (value) => {
        //   setLastKeyUp(value);
        // };
        inputRef.current.setValueClear = () => {
          inputRef.current.value = '';
        };
        keyDispatch({
          type: 'SET_REF',
          inputRef: inputRef,
        });
      }
      if (e.key === 'Backspace') {
        keyDispatch({
          type: 'BACKSPACE',
        });
        e.target.value = '';
        // setLastKeyDown(0);
        // setLastKeyUp(0);
      }
      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;
        // if (lastKeyUp === 0) setLastKeyUp(timeStamp);
        // if (lastKeyDown > 0) {
        //   const newKeyTimeDU = timeStamp - lastKeyDown;
        //   keyDispatch({
        //     type: 'KEY_UP',
        //     newKeyTime: [newKeyTimeDU],
        //     upList: timeStamp,
        //   });
        // }
        // setLastKeyUp(timeStamp);
      }
    },
    [keyDispatch, filteredKey, keyState.inputRef]
  );
  const handleUserId = useCallback(
    (e) => {
      keyDispatch({ type: 'TYPE_USER_ID', userId: e.target.value });
    },
    [keyDispatch]
  );

  return (
    <React.Fragment>
      {isPasswordInput ? (
        <input
          type="password"
          ref={inputRef}
          onChange={onChange}
          onKeyDown={handleKeydown}
          onKeyUp={handleKeyUp}
          {...rest}
        />
      ) : (
        <input
          type={type}
          onChange={onChange}
          onKeyDown={handleUserId}
          {...rest}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(Input);
