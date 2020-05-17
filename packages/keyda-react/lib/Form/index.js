import React from 'react';

const Form = (props, children) => {
  const { onSubmit, ...rest } = props;

  return (
    <React.Fragment>
      <form {...rest}>{children}</form>
    </React.Fragment>
  );
};

export default Form;
