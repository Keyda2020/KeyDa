import React, { useCallback } from 'react';
import { useKeyStateState } from '../Context';

const Form = (props) => {
  const { onSubmit, children, ...rest } = props;
  const keyState = useKeyStateState();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit();
      console.log(keyState);
    },
    [keyState, onSubmit]
  );

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </React.Fragment>
  );
};

export default React.memo(Form);
