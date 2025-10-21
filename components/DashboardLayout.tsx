"use client";
import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
    children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {

    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false)

    return (

        <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex relative">
            
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main content */}
            <div className={`w-full flex-1 flex flex-col transition-all duration-300`}>
                
                {/* Top Navbar */}
                <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-700">
                    <div className="flex gap-1.5 items-center">
                        
                        {/* Mobile toggle */}                
                        {!sidebarOpen && (<FaBars className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition" size={30} onClick={() => setSidebarOpen(true)} />)}
                        {sidebarOpen && (<FaTimes className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition" size={30} onClick={() => setSidebarOpen(false)} />)}                
                        
                        <h1 className="text-lg font-semibold text-cyan-400 tracking-wider">Zenith Dashboard</h1>

                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
                        >
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="Profile"
                                className="w-8 h-8 rounded-full border border-gray-700"
                            />
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-40">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 w-full text-left"
                                    onClick={() => router.push("/login")}
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>

            </div>

        </div>
    )
}