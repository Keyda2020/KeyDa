import React, { useState, useCallback } from 'react';
import { useKeyStateState, useKeyStateDispatch } from '../Context';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;
  const [lastKeyDown, setLastKeyDown] = useState(0.0);
  const [lastKeyUp, setLastKeyUp] = useState(0.0);
  const [userId, setUserId] = useState('');

  const keyState = useKeyStateState();
  const keyDispatch = useKeyStateDispatch();

  const handleKeydown = useCallback((e) => {
    const timeStamp = e.timeStamp;
    if (e.key !== 'Enter' && lastKeyDown !== 0.0 && lastKeyUp !== 0.0) {
      const newKeyTimeDD = timeStamp - lastKeyDown;
      const newKeyTimeUD = timeStamp - lastKeyUp;
      keyDispatch({
        type: 'KEY_DOWN',
        newKeyTime: [newKeyTimeDD, newKeyTimeUD],
      });
    }
    setLastKeyDown(timeStamp);
  }, []);

  const handleKeyUp = useCallback((e) => {
    const timeStamp = e.timeStamp;
    if (e.key !== 'Enter') {
      const newKeyTimeDU = timeStamp - lastKeyDown;
      keyDispatch({ type: 'KEY_UP', newKeyTime: [newKeyTimeDU] });
    }
    setLastKeyUp(timeStamp);
  });

  const handleUserId = useCallback((e) => {
    setUserId(e.target.value);
    keyDispatch({ type: 'TYPE_USER_ID', userId: userId });
  });

  return (
    <React.Fragment>
      {type === 'password' ? (
        <input
          type="password"
          onChange={onChange}
          onKeyDown={handleKeydown}
          onKeyUp={handleKeyUp}
          {...rest}
        />
      ) : (
        <input
          type={type}
          onChange={onChange}
          onKeyUp={handleUserId}
          {...rest}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(Input);
