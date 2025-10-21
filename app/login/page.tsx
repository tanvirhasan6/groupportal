'use client'

import { useState, ReactElement, FormEvent } from 'react'
import { useRouter } from "next/navigation"

type Screen = 'login' | 'forgot' | 'otp'

export default function AuthScreens(): ReactElement {

    const [screen, setScreen] = useState<Screen>('login')

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
            <div className="relative w-full max-w-sm p-0 bg-transparent rounded-2xl">
                
                <div className="rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur-md shadow-lg p-8">
                    {screen === 'login' && <LogIn onForgot={() => setScreen('forgot')} />}
                    {screen === 'forgot' && <ForgotPassword onBack={() => setScreen('login')} onNext={() => setScreen('otp')} />}
                    {screen === 'otp' && <OTPInput onBack={() => setScreen('forgot')} />}
                </div>

                <div className="absolute -top-16 -left-16 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

            </div>
        </div>

    )

}

type LogInProps = { onForgot: () => void }

function LogIn({ onForgot }: LogInProps): ReactElement {

    const router = useRouter()
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        try {
            
            const res = await fetch('http://localhost:5001/api/grpclaimportal/checkuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, password })
            })

            const data = await res.json()
            console.log(data?.status);            
            
            if ( data?.status===201) {
                router.replace(`/setPassword?userid=${encodeURIComponent(userid)}`)
            }

            if (data?.status!==200 || data?.status!==201) {
                setError(data?.message || 'Login failed')
                return
            }

        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome Back
            </h2>

            <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="userid" className="text-sm text-gray-300">Userid / Mobile</label>
                    <input
                        id="idmobile"
                        name="idmobile"
                        type="text"
                        placeholder="Enter your userid or mobile"
                        className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
                        value={userid}
                        onChange={e => setUserid(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm text-gray-300">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none transition"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-end text-sm">                   
                    <button type="button" onClick={onForgot} className="text-cyan-400 hover:underline cursor-pointer">Forgot?</button>
                </div>

                <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90 transition font-medium">Log In</button>
            </form>
        </div>
    )
}

type ForgotPasswordProps = { onBack: () => void; onNext: () => void }

function ForgotPassword({ onBack, onNext }: ForgotPasswordProps): ReactElement {

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Forgot Password</h2>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                <label htmlFor="identifier" className="text-sm text-gray-300">Email or Mobile</label>
                <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Enter your email or mobile"
                    className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
                />
                </div>

                <div className="flex justify-between">
                <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:underline cursor-pointer">Back</button>
                <button type="button" onClick={onNext} className="text-sm text-cyan-400 hover:underline cursor-pointer">Send OTP</button>
                </div>
            </form>
        </div>
    )
}

type OTPInputProps = { onBack: () => void }

function OTPInput({ onBack }: OTPInputProps): ReactElement {

    const router = useRouter()
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return
        const next = [...otp]
        next[index] = value
        setOtp(next)
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Enter OTP</h2>

            <form className="space-y-6 text-center" onSubmit={(e) => { e.preventDefault(); router.push("/dashboard") }}>
                <div className="flex justify-center gap-3">
                {otp.map((val, i) => (
                    <input
                    key={i}
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-semibold rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none transition"
                    />
                ))}
                </div>

                <div className="flex justify-between">
                <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:underline">Back</button>
                <button type="submit" className="text-sm text-cyan-400 hover:underline">Verify</button>
                </div>
            </form>
        </div>
    )
}