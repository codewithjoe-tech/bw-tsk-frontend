import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

import axiosInstance from "../../axios"
import { toast } from "sonner"
import { loginSchema, registerSchema } from "../../schemas"
import LoginForm from "../Forms/login-form"
import RegisterForm from "../Forms/register-form"
import type { AxiosError } from "axios"
import { getCookie } from "typescript-cookie"
import { useState } from "react"
import Otp from "../otp"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"





export function AuthCard() {
  const navigate = useNavigate()
  const [value, setValue] = useState('login')
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
    },
  })

  const  onLoginSubmit = async (values: z.infer<typeof loginSchema>) =>{
     try{

      const response = await axiosInstance.post("/api/auth/login", values)
      if (response.status === 200) {
       
        navigate('/')
        toast.success("Login Successfull", {
          description: "You have logged in successfully."
        })
      }
    }catch(error: unknown){
      const err = error as AxiosError<{ message: string , email: string  , password : string , full_name : string , detail: string}>;

       toast.error("Something went wrong",{
        description : err?.response?.data.message || err?.response?.data?.email ||  err?.response?.data?.full_name || err?.response?.data?.password || err?.response?.data?.detail 
      })
    }

  }

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
   
    // console.log("Register values:", values)
    try{

      const response = await axiosInstance.post("/api/auth/register", values)
      if (response.status === 201) {
        toast.success("Account created successfully", {
          description: "Verification email send to your email account."
        })
      }
    }catch(error: unknown){
      const err = error as AxiosError<{ message: string , email: string  , password : string , full_name : string , detail: string}>;

       toast.error("Something went wrong",{
        description : err?.response?.data.message || err?.response?.data?.email ||  err?.response?.data?.full_name || err?.response?.data?.password || err?.response?.data?.detail 
      })
    }
  }

  function handleOtpLogin() {
   setValue('otp')
  }





 


  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Login or create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={value} onValueChange={setValue} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="cursor-pointer" value="login">Login</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="register">Register</TabsTrigger>
          
          </TabsList>

          <TabsContent value="login">
            <LoginForm loginForm={loginForm} onLoginSubmit={onLoginSubmit} handleOtpLogin={handleOtpLogin} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm registerForm={registerForm} onRegisterSubmit={onRegisterSubmit} />
          </TabsContent>

          <TabsContent value="otp">
            <Otp  />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}