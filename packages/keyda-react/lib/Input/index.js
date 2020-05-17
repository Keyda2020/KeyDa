import React, { useState, useCallback, useEffect } from 'react';

const Input = (props) => {
  const { type, onChange, value, ...rest } = props;
  return <input {...rest} />;
};

export default Input;
