"use client";
import { useState, ReactNode, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/context/UserContext"
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }) {

    const router = useRouter()

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false)
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Runs only in the browser
        const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user_info="));

        if (!cookie) {
            router.replace("/login");
            return;
        }

        try {
            const parsed = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
            setUserInfo(parsed);
            if (!parsed.USERNAME) router.replace("/login")
        } catch (err) {
            console.error("Failed to parse user_info cookie:", err);
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5001/api/grpclaimportal/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: userInfo.USERNAME }),
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

        <UserContext.Provider value={userInfo}>
            <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex relative">

                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main content */}
                <div className={`w-full flex-1 flex flex-col transition-all duration-300`}>

                    {/* Top Navbar */}
                    <header className="flex items-center justify-between px-2 py-3 bg-gray-900 border-b border-gray-700">
                        <div className="flex gap-1.5 items-center">

                            {/* Mobile toggle */}
                            {!sidebarOpen && (<FaBars className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition" size={30} onClick={() => setSidebarOpen(true)} />)}
                            {sidebarOpen && (<FaTimes className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition" size={30} onClick={() => setSidebarOpen(false)} />)}

                            {/* <h1 className="text-lg font-semibold text-cyan-400 tracking-wider">Dashboard</h1> */}

                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                            >
                                <img
                                    src={`https://app.zenithlifebd.com/web_docs/${userInfo?.USERNAME}.jpg`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-gray-700"
                                />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg min-w-60 flex flex-col z-50">
                                    <h2 className="flex items-center gap-2 px-4 py-2 hover:bg-gray-950 w-full text-left">{userInfo.NAME}</h2>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-950 w-full text-left"
                                        onClick={handleLogout}
                                        disabled={loading}
                                    >
                                        Logout
                                        {
                                            loading ?
                                                (
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
                                                    </div>
                                                ) :
                                                (<FaSignOutAlt />)
                                        }
                                    </button>
                                </div>
                            )}
                        </div>

                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>

                </div>

            </div>

        </UserContext.Provider>
    )
}