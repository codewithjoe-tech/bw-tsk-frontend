import React from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import type { UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'
import type { loginSchema } from '../../schemas'

type Props = {
    loginForm : UseFormReturn<z.infer<typeof loginSchema>>
     onLoginSubmit: (data: z.infer<typeof loginSchema>) => void; 
     handleOtpLogin : () => void

}

const LoginForm = ({loginForm , onLoginSubmit ,handleOtpLogin}: Props) => {
  return (
        <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <Button type="submit" className="w-full">Login</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleOtpLogin}
                  >
                    Login with OTP
                  </Button>
                </div>
              </form>
            </Form>
  )
}

export default LoginForm