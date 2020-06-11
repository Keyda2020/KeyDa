import React, { useCallback } from 'react';

import { Form, Input, Button } from './lib';

const RegisterForm = (props) => {
  console.log(props);
  const handleSubmit = useCallback((e, res) => {
    console.log('Registered Successfully!');
    console.log(e, res);
  }, []);
  
  return (
    <div>
      <Form onSubmit={handleSubmit} formType="REGISTER">
        <Input type="email" onChange={(e) => e.target.value} />
        <br />
        <Input type="password" onChange={(e) => e.target.value} />
        <br />
        <Button register={true}>SIGN UP!</Button>
      </Form>
    </div>
  );
};

export default RegisterForm;
