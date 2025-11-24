'use client'

import { useState, ReactElement, FormEvent, useRef } from 'react'
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"


export default function AuthScreens() {

    const [screen, setScreen] = useState('login')
    const [userid, setUserid] = useState("")
    const [userData, setUserData] = useState(null);
    const [password, setPassword] = useState("");

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-4">
            <div className="relative w-full max-w-sm sm:max-w-md p-0 bg-transparent rounded-2xl">

                <div className="rounded-2xl border border-gray-700 bg-gray-900/70 backdrop-blur-md shadow-lg p-8">
                    {screen === "login" && (
                        <LogIn
                            onForgot={() => setScreen("forgot")}
                            onSuccess={(data) => {
                                setUserData(data);  // store full array
                                setScreen("set");
                            }}
                        />
                    )}
                    {screen === 'forgot' && <ForgotPassword onBack={() => setScreen('login')} onNext={() => setScreen('otp')} />}
                    {screen === 'otp' && <OTPInput onBack={() => setScreen('login')} userData={userData} password={password} />}
                    {
                        screen === 'set' &&
                        <SetPassword
                            userData={userData}
                            onBack={() => setScreen('login')}
                            onNext={() => setScreen('otp')}
                            setPassword={setPassword}
                            // onSubmit={function (e: FormEvent<HTMLFormElement>): void { throw new Error('Function not implemented.') }}
                        />
                    }
                </div>

                {/* <div className="absolute -top-16 -left-16 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" /> */}

            </div>
        </div>

    )

}


function LogIn({ onForgot, onSuccess }) {

    const router = useRouter()
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        setError('')

        try {

            const res = await fetch('http://localhost:5001/api/grpclaimportal/checkuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, password })
            })

            const data = await res.json()

            if (data?.status === 200) {

                await fetch("http://localhost:5001/api/grpclaimportal/checkuser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userid, password }),
                    credentials: "include",
                });

                router.replace("/dashboard");
                return

            }

            if (data?.status === 201) {
                onSuccess(data.result)
                return
            }

            if (data?.status !== 200 || data?.status !== 201) {
                setError(data?.message || 'Login failed')
                setLoading(false)
                return
            }


        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
            setLoading(false)
        } finally {
            setLoading(false); // ✅ hide loading
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome Back
            </h2>

            <form className="space-y-5" onSubmit={handleLogin} autoComplete="off">
                <div>
                    <label className="text-sm text-gray-300">Userid / Mobile</label>
                    <input
                        id="idmobile"
                        name="idmobile"
                        type="text"
                        placeholder="Enter your userid or mobile"
                        className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition"
                        value={userid}
                        onChange={e => setUserid(e.target.value)}
                        autoComplete="new-id"
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
                        autoComplete="new-password"
                    />
                </div>

                {/* <div className="flex items-center justify-end text-sm">                   
                    <button type="button" onClick={onForgot} className="text-cyan-400 hover:underline cursor-pointer">Forgot?</button>
                </div> */}

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90 transition font-medium"
                >
                    {loading ? (
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
                            <span>Logging in...</span>
                        </div>
                    ) : (
                        'Log In'
                    )}
                </button>
            </form>
        </div>
    )
}

function ForgotPassword({ onBack, onNext }) {

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
                        autoComplete="off"
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

function OTPInput({ onBack, password, userData }) {

    const router = useRouter()
    const [otp, setOtp] = useState(Array(8).fill(''))
    const inputsRef = useRef([])
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("")

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return; // only single numeric digit
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move focus to next input
        if (value && index < otp.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    const handlePaste = (e, index) => {
        e.preventDefault();

        // Get clipboard data and keep only digits
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasteData) return;

        const newOtp = [...otp];

        // Fill inputs starting from the currently focused input
        pasteData.split("").forEach((digit, i) => {
            if (index + i < otp.length) {
                newOtp[index + i] = digit;
            }
        });

        setOtp(newOtp);

        // Focus the next empty input after paste
        const nextIndex = Math.min(index + pasteData.length, otp.length - 1);
        inputsRef.current[nextIndex]?.focus();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        if (otp.includes("")) {
            setAlert("Please complete the OTP");
            return;
        }

        setLoading(true);
        setAlert("");

        try {
            // Example API call
            const res = await fetch(`http://localhost:5001/api/grpclaimportal/validateOtp?otpCode=${code}&password=${password}&userData=${encodeURIComponent(JSON.stringify(userData))}`);
            const data = await res.json();

            if (data?.status === 200) {
                router.replace("/dashboard");
            } else {
                setAlert(data.message || "OTP verification failed");
            }
        } catch (err) {
            setAlert("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Enter OTP</h2>

            {alert && (
                <div className="mb-4 px-4 py-2 rounded-lg bg-red-500 text-white text-sm text-center">
                    {alert}
                </div>
            )}

            <form className="space-y-6 text-center" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex justify-center gap-1.5 sm:gap-3">
                    {otp.map((val, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                inputsRef.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={(e) => handlePaste(e, i)} // pass current index
                            className="w-8 sm:w-10 h-12 text-center text-lg font-semibold rounded-lg bg-gray-800 border border-gray-700 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none transition"
                            autoComplete="off"
                        />
                    ))}
                </div>

                <div className="flex justify-between">
                    <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:underline">Back</button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="relative flex items-center justify-center text-sm text-cyan-400 hover:underline disabled:opacity-50"
                    >
                        {loading && (
                            <span className="absolute left-2 h-4 w-4 border-2 border-t-2 border-cyan-400 rounded-full animate-spin"></span>
                        )}
                        Verify
                    </button>
                </div>
            </form>
        </div>
    )
}

function SetPassword({ userData, onBack, onNext, setPassword }) {

    const [localPassword, setLocalPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordStrength = (pw) => {
        if (!pw) return { score: 0, label: "" };
        let score = 0;
        if (pw.length >= 5) score += 1;
        if (/[A-Z]/.test(pw)) score += 1;
        if (/[0-9]/.test(pw)) score += 1;
        if (/[^A-Za-z0-9]/.test(pw)) score += 1;
        const labels = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
        return { score, label: labels[score] };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // basic validations
        if (localPassword.length < 5) return setError("Password must be at least 5 characters.");
        if (localPassword !== confirm) return setError("Passwords do not match.");

        setLoading(true);

        try {

            const res = await fetch('http://localhost:5001/api/grpclaimportal/getPasswordOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userData })
            })

            const data = await res.json()

            if (data?.status === 200) {
                setPassword(localPassword)
                onNext()
            }

        } catch (err) {
            setError(`${err}.Could not update password. Try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const strength = passwordStrength(localPassword);

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-white">Reset password</h2>
                        <p className="text-sm text-slate-300">Pick a secure password.</p>
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm text-slate-300 mb-2">New password</label>
                    <input
                        type={showPwd ? "text" : "password"}
                        value={localPassword}
                        onChange={(e) => setLocalPassword(e.target.value)}
                        placeholder="At least 5 characters"
                        className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute right-2 top-9 p-2 rounded-md text-slate-200/80 hover:bg-white/5">
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>

                    {/* strength bar */}
                    <div className="mt-2">
                        <div className="h-2 w-full bg-white/6 rounded-full overflow-hidden">
                            <div
                                style={{ width: `${(strength.score / 4) * 100}%` }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                            />
                        </div>
                        <div className="mt-1 text-xs text-slate-300">{strength.label}</div>
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm text-slate-300 mb-2">Confirm password</label>
                    <input
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                        autoComplete="off"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-2 top-9 p-2 rounded-md text-slate-200/80 hover:bg-white/5">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && <div className="text-sm text-rose-400">{error}</div>}
                {success && <div className="text-sm text-emerald-300">{success}</div>}

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-400/60 to-indigo-500/60 hover:from-cyan-400/80 hover:to-indigo-500/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900">
                        {
                            loading ? (
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
                                    <span>Setting ...</span>
                                </div>
                            ) : (
                                'Set Password'
                            )
                        }
                    </button>
                </div>

                <div className="pt-2 text-center text-xs text-red-300">
                    Tip: Use a mix of upper & lower case letters, numbers, and symbols for a stronger password.
                </div>

                <button type="button" onClick={onBack} className="text-sm text-gray-400 hover:underline cursor-pointer">Back</button>
            </form>
        </div>
    );
}