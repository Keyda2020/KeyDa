import React, { useCallback } from 'react';
import _ from 'lodash';
import axios from 'axios';

import { useKeyStateState, useKeyStateDispatch } from '../Context';

const FormToSubmit = (props) => {
  const definedFormTypes = ['REGISTER', 'LOGIN'];
  const { onSubmit, formType, children, ...rest } = props;

  if (!formType) {
    throw new Error(
      'You should pass the "formType" prop explicitly to define a mechanism of KeyDa form.\nYou can choose one of "REGISTER", "LOGIN" matched with your usage.'
    );
  } else if (!_.includes(definedFormTypes, formType)) {
    throw new Error(
      'You passed wrong "formType". You can choose one of "REGISTER", "LOGIN" matched to your usage.'
    );
  }

  const REQUEST_URL = 'http://localhost:5000/api/users/'; // temporary request url : localhost of keyda-server
  const suffix = formType.toLowerCase();

  const keyState = useKeyStateState();
  const keyDispatch = useKeyStateDispatch();

  const registerSubmit = useCallback(
    (e) => {
      e.preventDefault();
      (async () => {
        const dataToSubmit = {
          keyTimeList: keyState.keyTimeList,
          userId: keyState.userId,
          trainCount: keyState.trainCount,
        };
        console.log(dataToSubmit);
        const request = await axios
          .post(REQUEST_URL + suffix, dataToSubmit)
          .then((response) => response);

        const responseCount = request.data.count;
        const status = request.status;
        console.log(request);
        keyDispatch({
          type: 'REGISTER',
          trainCount: responseCount,
        });

        console.log(keyState);
        if (responseCount === 5 && status === 200) {
          keyDispatch({
            type: 'SUBMIT',
          });
          onSubmit();
        }
      })(); // Immediately invoked function expression
      e.target.reset();
      keyState.inputRef.current.setLastKeyDown(0);
      keyState.inputRef.current.setLastKeyUp(0);
    },
    [keyState, onSubmit, keyDispatch, suffix]
  );

  const loginSubmit = useCallback(
    (e) => {
      e.preventDefault();
      (async () => {
        const dataToSubmit = {
          keyTimeList: keyState.keyTimeList,
          userId: keyState.userId,
        };

        const request = await axios
          .post(REQUEST_URL + suffix, dataToSubmit)
          .then((response) => response);

        const status = request.status;
        if (status === 200) {
          keyDispatch({
            type: 'SUBMIT',
          });
          onSubmit();
        }
      })();
      e.target.reset();
      keyState.inputRef.current.setLastKeyDown(0);
      keyState.inputRef.current.setLastKeyUp(0);
    },
    [onSubmit, suffix, keyState, keyDispatch]
  );

  const handleSubmit = formType === 'REGISTER' ? registerSubmit : loginSubmit;
  return (
    <div>
      <form onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </div>
  );
};

export default React.memo(FormToSubmit);
