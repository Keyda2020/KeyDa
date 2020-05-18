import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { KeyStateProvider } from './lib/Context';

ReactDOM.render(
  <React.StrictMode>
    <KeyStateProvider>
      <App />
    </KeyStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
