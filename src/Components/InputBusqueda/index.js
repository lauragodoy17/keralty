import './InputCard.css'

const InputBusqueda= ({type= "text", id, label, placeholder="holis", onChange, required=true, defaultValue=""})=>{
    return(
        <div className="input-container">
            <label htmlFor={id}>{label} {required && "*"}</label>
            <input
                type={type}
                placeholder={placeholder}
                name={id}
                id={id}
                onChange={(event) => {onChange( event.target.value)}}
                required
                defaultValue={defaultValue}
            />
        </div>
    )
}
export{InputBusqueda}