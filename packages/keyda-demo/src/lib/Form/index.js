import React, { useCallback } from 'react';

const Form = (props) => {
  const { onSubmit, children, ...rest } = props;

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit();
    console.log('inside of the library!');
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </React.Fragment>
  );
};

export default Form;
