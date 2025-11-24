'use client'

import React, { useRef, useState } from 'react'
import { useUser } from "@/app/context/UserContext";
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from "next/navigation";

const ChangePassword = () => {

    const user = useUser();
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [tryCount, setTryCount] = useState(0)

    const handlePasswordUpdate = async () => {

        if (user?.PASSWORD !== oldPassword) {
            setTryCount(tryCount + 1)
            toast.error(`Invalid Old Password! You have ${3 - (tryCount + 1)} more try!`)
            if (tryCount > 2) handleLogout()
            return
        } else {

            if (!oldPassword || !newPassword) {
                toast.error('Please insert your desired password first.')
                return
            }

            if (oldPassword === newPassword) {
                toast.error('Please insert a new password.')
                return
            }

            setLoading(true)
            try {
                const res = await fetch(
                    `http://localhost:5001/api/grpclaimportal/profile/passwordUpdate`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(
                            {
                                policyno: user?.POLICY_NO,
                                userid: user?.USERNAME,
                                newPassword
                            }
                        ),
                        credentials: "include",
                    }
                )
                const data = await res.json()

                if (data?.status === 200) {
                    toast.success('Password updated successfully.')
                    window.location.reload()
                } else {
                    toast.error(data?.message || 'Failed to update Password.')
                }
            } catch (err) {
                toast.error('Error updating password.')
            } finally {
                setLoading(false)
            }
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5001/api/grpclaimportal/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: user?.USERNAME }),
                credentials: "include",
            })

            const data = await res.json()

            if (data?.status === 200) {
                router.replace("/login")
            }
            setLoading(false)
        } catch (error) {
            toast(`${error}, cannot log out now!`)
            setLoading(false)
        }
    }

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center gap-4 mt-4'>

                <Toaster position="top-center" reverseOrder={false} />

                <div className='w-full flex flex-col sm:flex-row gap-2 items-center justify-center'>
                    <div>
                        {/* <label htmlFor='oldPassword' className="block text-sm font-medium mb-1">Old Password</label> */}
                        <input
                            id='oldPassword'
                            type="password"
                            placeholder="Enter Old Password"
                            className="w-96 border-0 border-b-1 border-gray-500 bg-transparent focus:border-cyan-200 focus:ring-0 focus:outline-none placeholder-gray-400 text-white"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        {/* <label htmlFor='newPassword' className="block text-sm font-medium mb-1">New Password</label> */}
                        <input
                            id='newPassword'
                            type="password"
                            placeholder="Enter New Password"
                            className="w-96 border-0 border-b-1 border-gray-500 bg-transparent focus:border-cyan-200 focus:ring-0 focus:outline-none placeholder-gray-400 text-white"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>


                <div className="flex justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-400/60 to-indigo-500/60 hover:from-cyan-400/80 hover:to-indigo-500/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100"
                        onClick={handlePasswordUpdate}
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
                                <span>Checking ...</span>
                            </div>
                        ) : 'Update Now'}
                    </button>
                </div>

            </div>
        </>
    )
}

export default ChangePassword