import React from 'react';
import './InputText.css';

const InputText = ({ placeholder }) => {
  return (
    <input type="text" className='inputText' placeholder={placeholder} />
  );
};

export default InputText;
