import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getCookie } from 'typescript-cookie'
import { Spinner } from '../components/ui/Spinner'
import { useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/global/navbar'

type Props = {}

const MainLayout = (props: Props) => {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
     useEffect(() => {
     
          const loggedin = getCookie('loggedin')
          console.log(loggedin)
          if (loggedin) {
             queryClient.invalidateQueries({
                      queryKey : ["currentUser"]
                    })
              setIsLoading(false)

            }else{
              navigate('/auth')
          }
      
      
      },[])
  return (
    
   <div className='bg-muted'>
         {
           isLoading ? (
            <div className='flex justify-center items-center h-screen bg-gray-700'>
              <Spinner size={'large'} />
            </div>
           ):<>
           <Navbar />
           <Outlet />
           </>
         }
         
       </div>
  )
}

export default MainLayout