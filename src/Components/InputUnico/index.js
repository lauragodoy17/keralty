import React, { useState } from 'react';
import './InputUnico.css'

function InputUnico() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className='input-container-cedula'>
      <input
        type="text"
        id="exampleInput"
        value={inputValue}
        placeholder='Ingresa el dato a buscar'
        onChange={handleChange}
      />
      <button className='Buscar'>Buscar</button>
    </div>
  );
}

export default InputUnico;