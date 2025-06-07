import React from 'react'
import { AuthCard } from '../../components/login/login-card'

type Props = {}

const LoginPage = (props: Props) => {
  return (
    <div className=' w-full h-screen flex justify-center items-center '>

   {/* <CardDemo /> */}
   <AuthCard />
    </div>
  )
}

export default LoginPage