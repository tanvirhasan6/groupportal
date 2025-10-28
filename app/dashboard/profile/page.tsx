'use client'

import React, { useState } from 'react'

import { useUser } from "@/app/context/UserContext";

type Panel = "email" | "mobile" | "password" | "bank" | null;

const page = () => {

    const user = useUser();

    console.log(user);
    

    const [activePanel, setActivePanel] = useState<Panel>(null);

    const togglePanel = (panel: Panel) => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    return (

        <div className="flex justify-center py-10 px-4">
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-6 mb-6">

                    <div className='w-full flex flex-col sm:flex-row gap-6 items-center'>

                        <img
                            src={`https://app.zenithlifebd.com/web_docs/${user?.USERNAME}.jpg`}
                            alt="profile-pic"
                            className="w-28 h-28 rounded-full border border-white/50 shadow"
                        />

                        <div>
                            <h2 className="text-lg font-semibold">{user?.NAME}</h2>
                            <p>Dept: {user?.DEPT_NAME}</p>
                            <p>Faculty: {user?.FACULTY}</p>
                            <p>ID: {user?.USERNAME}</p>
                        </div>

                    </div>

                    <hr className="w-full mx-auto border-spacing-0.5 border-gray-400" />

                    <div className="text-gray-100 space-y-1">

                        <div className='flex flex-col gap-4'>
                            <p className='px-3 py-2 rounded-lg border border-gray-500'>Account No: 1234567890</p>
                            <p className='px-3 py-2 rounded-lg border border-gray-500'>Bank: ABC Bank</p>
                            <p className='px-3 py-2 rounded-lg border border-gray-500'>Branch: Dhaka Main</p>
                            <p className='px-3 py-2 rounded-lg border border-gray-500'>Mobile: {user?.MOBILE}</p>
                            <p className='px-3 py-2 rounded-lg border border-gray-500'>Email: {user?.EMAIL}</p>
                            
                        </div>

                        <div className="flex flex-wrap gap-3 my-6">
                            <button
                                className={`px-4 py-2 rounded-lg text-white
                                            bg-gradient-to-r from-cyan-500 to-blue-600
                                            shadow-lg shadow-blue-900/40
                                            hover:from-cyan-400 hover:to-blue-500
                                            transition-all duration-300
                                            backdrop-blur-md bg-opacity-90 border border-white/20
                                ${activePanel === "email" ? "bg-blue-600 text-white" : "bg-white/20 hover:bg-white/30 text-gray-100"}
                                `}
                                onClick={() => togglePanel("email")}
                            >
                                Update Email
                            </button>
                        
                            <button
                                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600
                                            shadow-lg shadow-purple-900/40
                                            hover:from-purple-400 hover:to-pink-500
                                            transition-all duration-300
                                            backdrop-blur-md bg-opacity-90 border border-white/20
                                ${activePanel === "mobile" ? "bg-blue-600 text-white" : "bg-white/20 hover:bg-white/30 text-gray-100"}
                                `}
                                onClick={() => togglePanel("mobile")}
                            >
                                Update Mobile
                            </button>

                            <button
                                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600
               shadow-lg shadow-emerald-900/40
               hover:from-emerald-400 hover:to-teal-500
               transition-all duration-300
               backdrop-blur-md bg-opacity-90 border border-white/20
                                ${activePanel === "password" ? "bg-blue-600 text-white" : "bg-white/20 hover:bg-white/30 text-gray-100"}
                                `}
                                onClick={() => togglePanel("password")}
                            >
                                Change Password
                            </button>

                            <button
                                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600
               shadow-lg shadow-orange-900/40
               hover:from-orange-400 hover:to-amber-500
               transition-all duration-300
               backdrop-blur-md bg-opacity-90 border border-white/20
                                ${activePanel === "bank" ? "bg-blue-600 text-white" : "bg-white/20 hover:bg-white/30 text-gray-100"}
                                `}
                                onClick={() => togglePanel("bank")}
                            >
                                Update Bank Info
                            </button>
                        </div>

                    </div>

                </div>

                {/* Dynamic Panels */}
                {activePanel === "email" && (
                <UpdateCard title="Update Email">
                    <input type="email" placeholder="New Email" className="input-style"/>
                </UpdateCard>
                )}

                {activePanel === "mobile" && (
                <UpdateCard title="Update Mobile">
                    <input type="text" placeholder="New Mobile Number" className="input-style"/>
                </UpdateCard>
                )}

                {activePanel === "password" && (
                <UpdateCard title="Change Password">
                    <input type="password" placeholder="Current Password" className="input-style"/>
                    <input type="password" placeholder="New Password" className="input-style"/>
                </UpdateCard>
                )}

                {activePanel === "bank" && (
                <UpdateCard title="Update Bank Info">
                    <input type="text" placeholder="Bank Name" className="input-style"/>
                    <input type="text" placeholder="Branch Name" className="input-style"/>
                    <input type="text" placeholder="Account Number" className="input-style"/>
                </UpdateCard>
                )}

            </div>
        </div>
        
    )

    function UpdateCard({ title, children }: { title: string; children: React.ReactNode }) {
        return (
            <div className="bg-white/20 backdrop-blur-md border border-white/30 p-5 rounded-xl mt-4 text-gray-100">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <div className="flex flex-col gap-3">
                    {children}
                    <button className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-white">
                    Submit
                    </button>
                </div>
            </div>
        );
    }
}

export default page