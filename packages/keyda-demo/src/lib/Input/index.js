import React, {
  useState,
  useCallback,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import _ from 'lodash';

import { useKeyStateState, useKeyStateDispatch } from '../Context';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;
  const [lastKeyDown, setLastKeyDown] = useState(0);
  const [lastKeyUp, setLastKeyUp] = useState(0);

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
  const keyState = useKeyStateState();
  const inputRef = useRef();

  useImperativeHandle(inputRef, () => ({
    setLastKeyDown: (value) => {
      setLastKeyDown(value);
    },
    setLastKeyUp: (value) => {
      setLastKeyUp(value);
    },
  }));

  const handleKeydown = useCallback(
    (e) => {
      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;
        // console.log(lastKeyDown, lastKeyUp);
        // console.log('down', timeStamp);
        if (lastKeyDown === 0) setLastKeyDown(timeStamp);
        if (lastKeyDown > 0 && lastKeyUp > 0) {
          const newKeyTimeDD = timeStamp - lastKeyDown;
          const newKeyTimeUD = timeStamp - lastKeyUp;
          keyDispatch({
            type: 'KEY_DOWN',
            newKeyTime: [newKeyTimeDD, newKeyTimeUD],
          });
        }
        setLastKeyDown(timeStamp);
      }
    },
    [keyDispatch, lastKeyDown, lastKeyUp, filteredKey]
  );

  const handleKeyUp = useCallback(
    (e) => {
      if (_.isEqual(keyState.inputRef, {})) {
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
        setLastKeyDown(0);
        setLastKeyUp(0);
      }
      if (!_.includes(filteredKey, e.key)) {
        const timeStamp = e.timeStamp;
        // console.log(lastKeyDown, lastKeyUp);
        // console.log('up', timeStamp);
        if (lastKeyUp === 0) setLastKeyUp(timeStamp);
        if (lastKeyDown > 0) {
          const newKeyTimeDU = timeStamp - lastKeyDown;
          keyDispatch({ type: 'KEY_UP', newKeyTime: [newKeyTimeDU] });
        }
        setLastKeyUp(timeStamp);
      }
    },
    [keyDispatch, lastKeyDown, lastKeyUp, filteredKey, keyState.inputRef]
  );
  const handleUserId = useCallback(
    (e) => {
      keyDispatch({ type: 'TYPE_USER_ID', userId: e.target.value });
    },
    [keyDispatch]
  );

  return (
    <React.Fragment>
      {type === 'password' ? (
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

export default memo(forwardRef(Input));
