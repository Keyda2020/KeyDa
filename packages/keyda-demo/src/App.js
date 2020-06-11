import React from 'react';

import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

function App() {
  return (
    <div className="App">
      <h3>Register Form</h3>
      <RegisterForm />
      <br />
      <hr />
      <h3>Login Form</h3>
      <LoginForm />
    </div>
  );
}

export default App;
