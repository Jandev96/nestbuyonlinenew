import React from 'react'
import { useNavigate } from 'react-router-dom'

function ErrorPage() {
    const Navigate=useNavigate()
  return (
    <div>
        <h1>404 page</h1>
        <button className='btn btn-accent' onClick={()=> Navigate('/')}>Navigation to Home</button>


    </div>
  )
}

export default ErrorPage