import React, { useCallback } from 'react';
import { Form, Input } from './lib';

const RegisterForm = (props) => {
  console.log(props);
  console.log(Form);
  console.log(Input);
  const handleSubmit = useCallback(
    () => console.log('Successfully submitted!'),
    []
  );
  return (
    <div>
      <Form onSubmit={handleSubmit} formType="REGISTER">
        <Input type="email" onChange={(e) => e.target.value} />
        <br />
        <Input type="password" onChange={(e) => e.target.value} />
        <br />
        <button type="submit">SIGN UP!</button>
      </Form>
    </div>
  );
};

export default RegisterForm;
