import { z } from "zod";





export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})


export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})