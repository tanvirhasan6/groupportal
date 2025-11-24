'use client'

import React, { useEffect, useRef, useState } from 'react'

import { useUser } from "@/app/context/UserContext";
import { FaCamera, FaEdit } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast'
import ChangeEmail from './ChangeEmail';
import ChangeMobile from './ChangeMobile';
import ChangeBank from './ChangeBank';
import ChangePassword from './ChangePassword';

const page = () => {

    const user = useUser();

    const userid = user?.USERNAME

    // console.log(user);    

    const [activePanel, setActivePanel] = useState (null);
    const [accountData, setAccountData] = useState(null)
    const [imageSrc, setImageSrc] = useState(null);

    const fileInputRef = useRef(null);

    const togglePanel = (panel) => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    useEffect(() => {

        const bankData = async () => {

            try {
                const res = await fetch(
                    `http://localhost:5001/api/grpclaimportal/profile/basicInfo?userid=${userid}`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )

                const data = await res.json()

                if (data?.status === 200) {
                    setAccountData(data?.result)
                } else {
                    toast.error(data?.message)
                }

            } catch (error) {
                toast.error(`${error}`)
            }
        }

        if (userid) {
            setImageSrc(`https://app.zenithlifebd.com/web_docs/${userid}.jpg`)
            bankData()
        }

    }, [userid]);



    const handleImageClick = () => {
        fileInputRef.current?.click(); // open file picker
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result); // update image preview
            // TODO: upload the file to server here
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('http://localhost:5001/api/grpclaimportal/profile/uploadImage', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            const text = await res.text(); // read raw response
            let data;
            try {
                data = JSON.parse(text); // parse JSON if possible
            } catch {
                console.error('Server did not return JSON:', text);
                return;
            }

            console.log('Upload successful', data?.message);

        } catch (err) {
            console.error('Upload failed:', err);
            toast.error('Upload failed');
        }
    }

    return (

        <div className="flex flex-col gap-3 justify-center items-center py-10 px-4 text-sm">

            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">

                {/* Profile Header */}
                <div className="flex flex-col items-center gap-6 mb-6">

                    <div className='w-full flex flex-col sm:flex-row gap-6 items-center'>

                        <div className="relative w-32 h-32 rounded-full border border-white/50 shadow overflow-hidden">
                            {/* Profile Image */}
                            <img
                                src={imageSrc}
                                alt="profile-pic"
                                className="w-full h-full object-cover"
                            />

                            <button
                                type="button"
                                // onClick={handleImageClick}
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
                            >
                                <FaCamera />
                            </button>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">{user?.NAME}</h2>
                            <p>Dept: {user?.DEPT_NAME}</p>
                            <p>Faculty: {user?.FACULTY}</p>
                            <p>ID: {user?.USERNAME}</p>
                        </div>

                    </div>

                    <hr className="w-full mx-auto border-spacing-0.5 border-gray-400" />

                    <div className="w-full text-gray-100 space-y-1">

                        <div className='w-full gird grid-cols-2 gap-4'>

                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="accno"
                                    className="text-gray-300 text-sm mb-1"
                                >
                                    Account No
                                </label>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white w-full">

                                    <input
                                        type="accno"
                                        value={accountData?.ACCNO || ''}
                                        readOnly
                                        className="bg-transparent focus:outline-none flex-1 text-white placeholder-gray-400 cursor-default"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        onClick={() => togglePanel("bank")}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="bank"
                                    className="text-gray-300 text-sm mb-1"
                                >
                                    Bank
                                </label>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white w-full">

                                    <input
                                        type="bank"
                                        value={accountData?.BANKNAME || ''}
                                        readOnly
                                        className="bg-transparent focus:outline-none flex-1 text-white placeholder-gray-400 cursor-default"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        onClick={() => togglePanel("bank")}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="branch"
                                    className="text-gray-300 text-sm mb-1"
                                >
                                    Branch
                                </label>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white w-full">

                                    <input
                                        type="branch"
                                        value={accountData?.BRANCHNAME || ''}
                                        readOnly
                                        className="bg-transparent focus:outline-none flex-1 text-white placeholder-gray-400 cursor-default"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        onClick={() => togglePanel("bank")}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="mobile"
                                    className="text-gray-300 text-sm mb-1"
                                >
                                    Mobile
                                </label>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white w-full">
                                    <input
                                        type="mobile"
                                        value={user?.MOBILE || ""}
                                        readOnly
                                        className="bg-transparent focus:outline-none flex-1 text-white placeholder-gray-400 cursor-default"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        onClick={() => togglePanel("mobile")}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label
                                    htmlFor="email"
                                    className="text-gray-300 text-sm mb-1"
                                >
                                    Email-Id
                                </label>
                                <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-500 bg-transparent text-white w-full">
                                    <input
                                        type="email"
                                        value={user?.EMAIL || ""}
                                        readOnly
                                        className="bg-transparent focus:outline-none flex-1 text-white placeholder-gray-400 cursor-default"
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                                        onClick={() => togglePanel("email")}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-3 my-6">

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

                        </div>

                    </div>

                </div>

            </div>

            {
                (activePanel === "email" || activePanel === "mobile" || activePanel === "password" || activePanel === "bank") &&

                <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
                    {/* Dynamic Panels */}
                    {activePanel === "email" && (
                        <UpdateCard title="Update Email">
                            <ChangeEmail />
                        </UpdateCard>
                    )}

                    {activePanel === "mobile" && (
                        <UpdateCard title="Update Mobile">
                            <ChangeMobile />
                        </UpdateCard>
                    )}

                    {activePanel === "password" && (
                        <UpdateCard title="Change Password">
                            <ChangePassword />
                        </UpdateCard>
                    )}

                    {activePanel === "bank" && (
                        <UpdateCard title="Update Bank Info">
                            <ChangeBank />
                        </UpdateCard>
                    )}
                </div>
            }

        </div>

    )

    function UpdateCard({ title, children }) {
        return (
            <div className="w-full">
                <h3 className="text-center text-lg underline font-semibold mb-3">{title}</h3>
                <div className="w-full flex flex-col gap-1">

                    {children}

                    {/* <div>
                        <button 
                            type='button' 
                            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg text-white"
                        >
                        Submit
                        </button>
                    </div> */}

                </div>
            </div>
        );
    }
}

export default page