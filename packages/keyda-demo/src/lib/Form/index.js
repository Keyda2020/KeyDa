import React, { useCallback } from 'react';
import _ from 'lodash';
import axios from 'axios';

import { useKeyStateState } from '../Context';

const Form = (props) => {
  const definedFormTypes = ['REGISTER', 'LOGIN', 'PASSWORD_CHANGE'];

  const { onSubmit, formType, children, ...rest } = props;

  if (!formType) {
    throw new Error(
      'You should pass the "formType" prop explicitly to define a mechanism of KeyDa form.\nYou can choose one of "REGISTER", "LOGIN", "PASSWORD_CHANGE" matched with your usage.'
    );
  } else if (!_.includes(definedFormTypes, formType)) {
    throw new Error(
      'You passed wrong "formType". You can choose one of "REGISTER", "LOGIN", "PASSWORD_CHANGE" matched with your usage.'
    );
  }

  const keyState = useKeyStateState();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData();
      console.log(formData);
      onSubmit();
      const post = await axios.post(
        'http://localhost:5000/api/users/register',
        'hello'
      );
      console.log(post);
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
