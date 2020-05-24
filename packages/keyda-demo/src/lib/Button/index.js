import React from 'react';

import { useKeyStateContext } from '../Context';

const MAX_TRAIN_COUNT = 5;

const Button = (props) => {
  const { children, register, ...rest } = props;
  const keyState = useKeyStateContext();

  if (register === undefined) {
    throw new Error(
      'You have to pass the "register" prop explicitly to let the button know it is registration form.\nYou can choose boolean type value {true} or {false} depends on your formType.'
    );
  } else if (typeof register !== 'boolean') {
    throw new Error(
      'You have to pass the "register" prop as a "boolean" value.'
    );
  }

  const givenText = children ? children : '';
  const countText = register
    ? ` (${keyState.trainCount + 1} / ${MAX_TRAIN_COUNT})`
    : '';
  return (
    <button type="submit" {...rest}>
      {`${givenText}${countText}`}
    </button>
  );
};

export default React.memo(Button);
