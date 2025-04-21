import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../config/axiosInstance'

function Login() {

  const {register,handleSubmit}=useForm()
  const navigate=useNavigate()
  const user={

  }
  if(role==""){

  }



    const onSubmit=  async (data)=>{
      console.log(data)
      try {
        const response= await axiosInstance({
          method:'POST',
          url:user.loginAPI,
          data:data,
        })
        
      } catch (error) {
        
      }

    }
  return (
    <div>
       <h1>Login</h1> 
        
    </div>
  )
}

export default Login