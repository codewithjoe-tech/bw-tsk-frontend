import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'
import { Spinner } from '../components/ui/Spinner'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
 
      const loggedin = getCookie('loggedin')
      console.log(loggedin)
      if (loggedin) {
        navigate('/')
      }else{
        setIsLoading(false)
      }
  
  
  },[])

  return (
    <div className='bg-muted'>
      {
        isLoading ? (
         <div className='flex justify-center items-center h-screen'>
           <Spinner size={'large'} />
         </div>
        ):<Outlet />
      }
      
    </div>
  )
}

export default AuthLayout
