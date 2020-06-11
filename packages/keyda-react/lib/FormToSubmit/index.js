import React, { useCallback } from 'react';
import _ from 'lodash';
import axios from 'axios';

import { useKeyStateContext, useKeyStateDispatch } from '../Context';

const keyTypePatternComputation = (keyUpList, keyDownList) => {
  const computeList = [];

  for (let i = 0; i < keyDownList.length; i++) {
    if (i === 0) {
      computeList.push(
        ((keyUpList[i] - keyDownList[i]) / 1000).toFixed(4).toString()
      );
    } else {
      computeList.push(
        ((keyDownList[i] - keyDownList[i - 1]) / 1000).toFixed(4).toString()
      );
      computeList.push(
        ((keyDownList[i] - keyUpList[i - 1]) / 1000).toFixed(4).toString()
      );
      computeList.push(
        ((keyUpList[i] - keyDownList[i]) / 1000).toFixed(4).toString()
      );
    }
  }
  return computeList;
};

const FormToSubmit = (props) => {
  const MAX_TRAIN_COUNT = 10;
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

  const keyState = useKeyStateContext();
  const keyDispatch = useKeyStateDispatch();

  const registerSubmit = useCallback(
    (e) => {
      e.preventDefault();
      (async () => {
        e.persist();
        const keyDownList = keyState.keyDownList;
        const keyUpList = keyState.keyUpList;

        const isWrongTypingDetected = keyUpList.length !== keyDownList.length;
        if (isWrongTypingDetected) {
          console.warn('Unmatched typing is detected!');
          keyDispatch({
            type: 'WRONG_TYPING',
          });
          return;
        }

        const keyTimeList = keyTypePatternComputation(keyUpList, keyDownList);

        const dataToSubmit = {
          keyTimeList: keyTimeList,
          userId: keyState.userId,
          trainCount: keyState.trainCount,
        };
        console.log(dataToSubmit);
        const request = await axios
          .post(REQUEST_URL + suffix, dataToSubmit)
          .then((response) => response);

        const { count, error, message, success } = request.data;
        const status = request.status;
        if (error) {
          console.error(message);
        }
        console.log(request);
        keyDispatch({
          type: 'REGISTER',
          trainCount: count,
        });

        console.log(keyState);
        if (count === MAX_TRAIN_COUNT && status === 200) {
          keyDispatch({
            type: 'SUBMIT',
          });
          onSubmit(e, request);
          e.target.reset();
        }
      })(); // Immediately invoked function expression
      if (keyState.inputRef.current) {
        keyState.inputRef.current.setValueClear();
      }
    },
    [keyState, onSubmit, keyDispatch, suffix]
  );

  const loginSubmit = useCallback(
    (e) => {
      e.preventDefault();
      (async () => {
        e.persist();
        const keyDownList = keyState.keyDownList;
        const keyUpList = keyState.keyUpList;

        const isWrongTypingDetected = keyUpList.length !== keyDownList.length;
        if (isWrongTypingDetected) {
          console.warn('Unmatched typing is detected!');
          keyDispatch({
            type: 'WRONG_TYPING',
          });
          return;
        }

        const keyTimeList = keyTypePatternComputation(keyUpList, keyDownList);

        const dataToSubmit = {
          keyTimeList: keyTimeList,
          userId: keyState.userId,
        };

        const request = await axios
          .post(REQUEST_URL + suffix, dataToSubmit)
          .then((response) => response);

        const { error, message, accuracy, success } = request.data;
        const status = request.status;
        if (error) {
          console.error(message);
        }
        console.log(request);

        keyDispatch({
          type: 'SUBMIT',
        });
        if (status === 200) {
          onSubmit(e, request); // to transfer the accuracy score to developer, it's inevitable to write this way. So, it will be noticed to user developer.
        }
      })();
      e.target.reset();
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
