import React, { useState, useCallback, useEffect } from 'react';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;

  const [keyStrokeTimes, setKeyStrokeTimes] = useState([]);

  const handleKeydown = useCallback((e) => {
    console.log('downtime', e.timeStamp);
    console.log(e.key);
  }, []);

  const handleKeyUp = useCallback((e) => {
    console.log('uptime', e.timeStamp);
    console.log(e.key);
  });

  return (
    <React.Fragment>
      <input
        type={type}
        onChange={onChange}
        onKeyDown={handleKeydown}
        onKeyUp={handleKeyUp}
        {...rest}
      />
    </React.Fragment>
  );
};

export default Input;
