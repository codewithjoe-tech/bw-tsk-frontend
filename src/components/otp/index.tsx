import React, { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { toast } from "sonner"
import axiosInstance from "../../axios"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { setCookie } from "typescript-cookie"

const MAX_ATTEMPTS = 3

const Otp = () => {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<"email" | "otp">("email")
    const [attempt, setAttempt] = useState(0)
    const [waitingTime, setWaitingTime] = useState(0)
    const navigate = useNavigate()
    // Timer countdown effect
    useEffect(() => {
        if (waitingTime <= 0) return
        const interval = setInterval(() => {
            setWaitingTime((prev) => {
                if (prev <= 1) clearInterval(interval)
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [waitingTime])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    }

    const getCooldownTime = (attempt: number): number => {
        if (attempt === 1) return 60
        if (attempt === 2) return 180
        if (attempt >= 3) return 7200
        return 0
    }

    const handleEmailSubmit = async () => {
        if (!email) {
            toast.error("Please enter a valid email")
            return
        }

        try {
            const response = await axiosInstance.post("/api/auth/login-otp", { email })

            if (response.status === 200) {
                setStep("otp")
                setOtp("")
                setAttempt(0)
                toast.success("OTP sent successfully", {
                    description: "Check your email for the OTP"
                })
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string, detail: string }>;

            toast.error("Unsuccessful action!", {
                description: err?.response?.data.message || err?.response?.data?.detail
            })
        }
    }

    const handleResendOtp = async () => {
        if (attempt >= MAX_ATTEMPTS) return

        try {
            const response = await axiosInstance.post("/api/auth/login-otp", { email })
            if (response.status === 200) {
                toast.success("OTP resent",{
                    description: "Check your email for the OTP"
                })
                const nextAttempt = attempt + 1
                setAttempt(nextAttempt)
                setWaitingTime(getCooldownTime(nextAttempt))
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string, detail: string }>;

            toast.error("Unsuccessful action!", {
                description: err?.response?.data.message || err?.response?.data?.detail
            })
        }
    }

    const handleOtpSubmit = async () => {
        if (!otp) {
            toast.error("Enter the OTP",{
                description: "Check your email for the OTP"
            })
            return
        }

        try {
            const res = await axiosInstance.post("/api/auth/verify-otp", { email, otp })
            if (res.status === 200) {
                toast.success("OTP verified successfully!", {
                    description: "You have logged in successfully"
                })
                // success logic
                setCookie('loggedin', 'true')
                navigate('/')
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string, detail: string }>;

            toast.error("Unsuccessful action!", {
                description: err?.response?.data.message || err?.response?.data?.detail
            })
        }
    }

    return (
        <>
            {step === "email" ? (
                <>
                    <Label className="mb-2" htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email"
                    />
                    <Button className="mt-4" onClick={handleEmailSubmit}>
                        Send OTP
                    </Button>
                </>
            ) : (
                <>
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        placeholder="Enter the OTP"
                    />
                    <div className="flex items-center gap-2 mt-4">
                        <Button onClick={handleOtpSubmit}>Verify OTP</Button>
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground">
                        {attempt >= MAX_ATTEMPTS ? (
                            <span className="text-destructive">
                                Maximum attempts reached. Please use email & password to login.
                            </span>
                        ) : waitingTime > 0 ? (
                            <span className="text-muted-foreground">
                                Resend OTP in {formatTime(waitingTime)}
                            </span>
                        ) : (
                            <span
                                onClick={handleResendOtp}
                                className="text-blue-600 hover:underline cursor-pointer"
                            >
                                Resend OTP
                            </span>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default Otp
