import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const AuthLayout = (props: Props) => {
  return (
   <div className='bg-muted'>
   <Outlet />
   </div>
  )
}

export default AuthLayout