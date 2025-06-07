import React, { useEffect } from 'react'
import { Spinner } from '../../components/ui/Spinner'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from '../../axios'
import { toast } from 'sonner'

type Props = {}

const EmailVerify = (props: Props) => {
    const {token} = useParams()
    const navigate = useNavigate()
    const verifyToken = async()=>{
        const response = await axiosInstance.get(`api/auth/verify-email/${token}`)
        if(response.status === 200){
            toast.success('Email verified successfully',{
                description : "Your email has been verified successfully"
            })
            navigate('/auth')
        }else{
            toast.error('Invalid URL',{
                description : "Try logging in again to generate a valid link."
            })
        }
    }
    useEffect(() => {
     verifyToken()
    }, [token])
    
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Spinner size={'large'} />
    </div>
  )
}

export default EmailVerify