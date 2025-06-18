import React from 'react'
import InputText from '../../components/InputText/InputText'
import Btn from '../../components/button/Btn'
import "./login.css"

function Login() {
  return (
    <div className='login'>
      <h5>Iniciar sesion</h5>
      <div className='inputWrapper'>
        <InputText placeholder={"Usuario"} />
        <InputText placeholder={"Contraseña"} />

      </div>
      <div>

        <Btn text={"Iniciar"} />
      </div>

    </div>
  )
}

export default Login
