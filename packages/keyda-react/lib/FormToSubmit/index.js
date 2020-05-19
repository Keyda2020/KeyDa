import React, { useCallback } from 'react';
import _ from 'lodash';
import axios from 'axios';

import { useKeyStateState, useKeyStateDispatch } from '../Context';

const FormToSubmit = (props) => {
  const definedFormTypes = ['REGISTER', 'LOGIN', 'CHANGE_PW'];
  const { onSubmit, formType, children, ...rest } = props;

  if (!formType) {
    throw new Error(
      'You should pass the "formType" prop explicitly to define a mechanism of KeyDa form.\nYou can choose one of "REGISTER", "LOGIN", "CHANGE_PW" matched with your usage.'
    );
  } else if (!_.includes(definedFormTypes, formType)) {
    throw new Error(
      'You passed wrong "formType". You can choose one of "REGISTER", "LOGIN", "CHANGE_PW" matched with your usage.'
    );
  }

  const REQUEST_URL = 'http://localhost:5000/api/users/'; // temporary request url : localhost of keyda-server
  const suffix = formType.toLowerCase();

  const keyState = useKeyStateState();
  const keyDispatch = useKeyStateDispatch();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setTimeout(() => {
        const formData = new FormData();
        console.log(formData);
        formData.append('keyTimeList', keyState.keyTimeList);
        formData.append('userId', keyState.userId);

        axios.post(REQUEST_URL + suffix, formData).then((response) => {
          console.log(response);
        });

        keyDispatch({
          type: 'REGISTER',
        });

        console.log(keyState);
        if (keyState.trainCount + 1 === 5) {
          keyDispatch({
            type: 'SUBMIT',
          });
          onSubmit();
        }
      }, 500);
      e.target.reset();
      keyState.inputRef.current.setLastKeyDown(0);
      keyState.inputRef.current.setLastKeyUp(0);
    },
    [keyState, onSubmit, keyDispatch, suffix]
  );
  return (
    <div>
      <form onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </div>
  );
};

export default React.memo(FormToSubmit);
