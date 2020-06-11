import React, { useCallback, useRef } from 'react';
import _ from 'lodash';

import { useKeyStateContext, useKeyStateDispatch } from '../Context';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;
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
      const isNotClearAtStart =
        e.target.value === '' &&
        (!_.isEqual(keyState.keyDownList, []) ||
          !_.isEqual(keyState.keyUpList, []));
      if (isNotClearAtStart) {
        keyDispatch({
          type: 'CLEAR_PW',
        });
      }

      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;

        keyDispatch({
          type: 'KEY_DOWN',
          keyDownList: timeStamp,
        });
      }
    },
    [keyDispatch, filteredKey, keyState.keyDownList, keyState.keyUpList]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (_.isEqual(keyState.inputRef, {})) {
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
      }
      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;
        keyDispatch({
          type: 'KEY_UP',
          keyUpList: timeStamp,
        });
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
