import React, { useState } from 'react';
import './InputCedula.css'
function InputComponent() {
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
        placeholder='Ingresa la cédula a buscar'
        onChange={handleChange}
      />
       <input
        type="text"
        id="exampleInput"
        value={inputValue}
        placeholder='Ingresa la empresa a buscar'
        onChange={handleChange}
      />
        <input
        type="text"
        id="exampleInput"
        value={inputValue}
        placeholder='Ingresa la regional a buscar'
        onChange={handleChange}
      />
        <input
        type="text"
        id="exampleInput"
        value={inputValue}
        placeholder='Ingresa el cargo a buscar'
        onChange={handleChange}
      />
      <button className='Buscar'>Buscar</button>
    </div>
  );
}

export default InputComponent;
