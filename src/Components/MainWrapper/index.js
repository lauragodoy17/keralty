import React from 'react'

 const MainWrapper=({buttons, selectedOption, setSelectedOption, nombre})=>{
    
    return(
        <div className="main-wrapper_busqueda">
            <div className='info-and-buttons-container'>
                <div className='title-and-role-container'>
                    <p>Hola! Estás en el perfil de {nombre}</p>
                </div>

                <div className='functions-container'>

                    <h2>Datos de búsqueda</h2>
                    {Object.keys(buttons).map((item,index)=>(
                        <button onClick={()=>{setSelectedOption(item)}}> {item}</button>
                    ))}

                </div>               
            </div>

            <div className='form-and-info-wrapper'>
                {buttons[selectedOption]}
            </div>

        </div>
        
    )
 }
 export default MainWrapper;