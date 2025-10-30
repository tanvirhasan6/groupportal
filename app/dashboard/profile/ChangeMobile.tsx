'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useUser } from "@/app/context/UserContext";
import toast, { Toaster } from 'react-hot-toast'

const ChangeMobile = () => {

    const user = useUser();

    const [mobile, setMobile] = useState('')
    const [otp, setOtp] = useState<string[]>(Array(8).fill(''))

    const inputsOTPRef = useRef<HTMLInputElement[]>([])
    
    const [loading, setLoading] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)

    // ✅ Validate Bangladeshi mobile number
    const isValidMobile = (mobile: string) => {
        return /^(?:\+88|88)?(01[3-9]\d{8})$/.test(mobile)
    }

    // Auto focus first OTP box when OTP section loads
    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                inputsOTPRef.current[0]?.focus();
            }, 100);
        }
    }, [loading]);

    const handleOTPChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            inputsOTPRef.current[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputsOTPRef.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsOTPRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputsOTPRef.current[index + 1]?.focus();
        }
    }

    const handleOTPPaste = (e, index) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasteData) return;

        const newOtp = [...otp];
        pasteData.split("").forEach((digit, i) => {
            if (index + i < otp.length) {
                newOtp[index + i] = digit;
            }
        });

        setOtp(newOtp);
        const nextIndex = Math.min(index + pasteData.length, otp.length - 1);
        inputsOTPRef.current[nextIndex]?.focus();
    }

    const handleMobileUpdate = async () => {
        setLoading(true)
        
        if (!mobile) {
            toast.error('Please enter your mobile number.')
            setLoading(false)
            return
        } 
        else if (!isValidMobile(mobile)) {
            toast.error('Invalid mobile number format.')
            setLoading(false)
            return
        }
        else if (mobile.length>11) {
            toast.error('Mobile No too long.')
            setLoading(false)
            return
        }
        else {
            try {
                const sendOtp = await fetch(
                    `http://localhost:5001/api/grpclaimportal/profile/mobileChange?policyno=${user?.POLICY_NO}&userid=${user?.USERNAME}&mobile=${mobile}&emailid=${user?.EMAIL}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )

                const data = await sendOtp.json()
                console.log(data)

                if (data?.status === 201) {
                    toast.error(`${data?.message}`)
                    setLoading(false)
                }

                if (data?.status === 200) {
                    toast.success(`OTP sent to your email`)
                }

            } catch (error) {
                toast.error(`${error}`)
                setLoading(false)
            }
        }
    }

    const handleVerifyOTP = async () => {
        setOtpLoading(true)

        const code = otp.join("");
        if (otp.includes("")) {
            toast.error("Please complete the OTP");
            setOtpLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5001/api/grpclaimportal/profile/mobileChangeOTPVerify?otpCode=${code}&mobile=${mobile}&policyno=${user?.POLICY_NO}&userid=${user?.USERNAME}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            )
            const data = await res.json();
            
            if (data?.status === 200) {
                toast.success("Mobile number successfully updated")
                setLoading(false)
                window.location.reload()
            } else {
                toast.error(`${data?.message}`)
                inputsOTPRef.current[0]?.focus()
            }
            setOtpLoading(false)

        } catch (error) {
            console.log(`${error}`)
            toast.error(`${error}`)
            setOtpLoading(false)
        }
    }

    return (
        <>    
            <div className='w-full flex flex-row justify-center items-center gap-2'>
                
                <Toaster position="top-center" reverseOrder={false} />

                <input 
                    type="tel"
                    placeholder="New Mobile Number"
                    className="w-96 border-0 border-b-1 border-gray-500 bg-transparent focus:border-cyan-200 focus:ring-0 focus:outline-none placeholder-gray-400 text-white"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                {    
                    !loading &&
                    <button 
                        type='button' 
                        className="text-sm text-cyan-400 hover:underline disabled:opacity-50"
                        onClick={handleMobileUpdate}
                    >
                        Submit
                    </button>
                }
                
            </div>                        

            {   
                loading &&
                <div className='mt-3 flex flex-col items-center gap-3'>
                    <div className="flex justify-center gap-1.5 sm:gap-3">
                        {otp.map((val, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputsOTPRef.current[i] = el!)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={val}
                                onChange={(e) => handleOTPChange(i, e.target.value)}
                                onKeyDown={(e) => handleOTPKeyDown(i, e)}
                                onPaste={(e) => handleOTPPaste(e, i)}
                                className="w-8 sm:w-10 h-12 text-center text-lg font-semibold rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none transition"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={otpLoading}
                            className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-400/60 to-indigo-500/60 hover:from-cyan-400/80 hover:to-indigo-500/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                            onClick={handleVerifyOTP}
                        >
                            {otpLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    <span>Verifying ...</span>
                                </div>
                            ) : 'Verify OTP'}
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default ChangeMobile
