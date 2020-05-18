import React from 'react';

import FormToSubmit from '../FormToSubmit';
import { KeyStateProvider } from '../Context';

const Form = (props) => {
  return (
    <React.Fragment>
      <KeyStateProvider>
        <FormToSubmit {...props} />
      </KeyStateProvider>
    </React.Fragment>
  );
};

export default React.memo(Form);
