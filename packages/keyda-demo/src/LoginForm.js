import React, { useCallback } from 'react';

import { Form, Input, Button } from './lib';

const LoginForm = (props) => {
  console.log(props);
  const handleSubmit = useCallback((e, res) => {
    // as written in FormToSubmit.js, developer should evince the second parameter.
    console.log('Logged in Successfully!');
    console.log(e, res);
  }, []);
  return (
    <div>
      <Form onSubmit={handleSubmit} formType="LOGIN">
        <Input type="email" onChange={(e) => e.target.value} />
        <br />
        <Input type="password" onChange={(e) => e.target.value} />
        <br />
        <Button register={false}>SIGN IN!</Button>
      </Form>
    </div>
  );
};

export default LoginForm;
