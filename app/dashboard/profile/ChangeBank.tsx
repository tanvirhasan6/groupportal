'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from "@/app/context/UserContext"
import toast, { Toaster } from 'react-hot-toast'
import SearchableSelect from '@/components/SearchableSelect'

const ChangeBank = () => {
    const user = useUser()

    const [bankType, setBankType] = useState('')
    const [bankList, setBankList] = useState<{ BANKCODE: string; BANKNAME: string }[]>([])
    const [bank, setBank] = useState('')
    const [branchList, setBranchList] = useState<{ ROUTINGNO: string; BRANCHNAME: string }[]>([])
    const [branch, setBranch] = useState('')
    const [accno, setAccno] = useState('')
    const [loading, setLoading] = useState(false)

    // Fetch bank list when bank type changes
    useEffect(() => {

        setBank('')
        setBranch('')
        setBankList([])
        setBranchList([])

        if (!bankType) return
        
        const fetchBanks = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5001/api/grpclaimportal/profile/getBanks?banktype=${bankType}`,
                    { method: 'GET', credentials: 'include' }
                )
                const data = await res.json() 

                if (data?.status === 200) {
                    const formatted = (data.result || []).map((item: any) => ({
                        value: item.BANKCODE,   // or whatever your field name is
                        label: item.BANKNAME,   // adjust based on your API
                    }))
                    
                    setBankList(formatted)
                } else {
                    setBankList([])
                    toast.error(data?.message || 'No banks found.')
                }
            } catch (err) {
                toast.error('Failed to load bank list.')
            }
        }

        fetchBanks()
    }, [bankType])

    // Fetch branch list when bank changes
    useEffect(() => {
        
        setBranchList([])
        
        if (!bank || !bankType) return
        setBranch('')
        const fetchBranches = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5001/api/grpclaimportal/profile/getBankBranch?banktype=${bankType}&bankcode=${bank}`,
                    { method: 'GET', credentials: 'include' }
                )
                const data = await res.json()
                
                if (data?.status === 200) {
                    const formatted = (data.result || []).map((item: any) => ({
                        value: item.ROUTINGNO,   // or whatever your field name is
                        label: item.BRANCHNAME,   // adjust based on your API
                    }))
                    setBranchList(formatted)
                } else {
                    setBranchList([])
                    toast.error(data?.message || 'No branches found.')
                }
            } catch (err) {
                toast.error('Failed to load branch list.')
            }
        }

        fetchBranches()
    }, [bank])

    const handleBankUpdate = async () => {
        if (!bankType || !bank || !branch) {
            toast.error('Please select Bank Type, Bank, and Branch.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(
                `http://localhost:5001/api/grpclaimportal/profile/bankChange?policyno=${user?.POLICY_NO}&userid=${user?.USERNAME}&banktype=${bankType}&bank=${bank}&branch=${branch}`,
                { method: 'GET', credentials: 'include' }
            )
            const data = await res.json()

            if (data?.status === 200) {
                toast.success('Bank information updated successfully.')
                window.location.reload()
            } else {
                toast.error(data?.message || 'Failed to update bank info.')
            }
        } catch (err) {
            toast.error('Error updating bank information.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-3">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <SearchableSelect
                    label="Bank Type"
                    options={[
                        { value: 'G', label: 'General Banking' },
                        { value: 'A', label: 'Agent Banking' },
                        { value: 'M', label: 'Mobile Banking' },
                    ]}
                    value={bankType}
                    onChange={setBankType}
                    placeholder="Select Bank Type"
                    onFocus={(e) => e.target.select()}
                />
                
                <SearchableSelect
                    label="Bank Name"
                    options={bankList}
                    value={bank}
                    onChange={setBank}
                    placeholder="Select Bank"
                    disabled={!bankType || bankList.length === 0}
                    onFocus={(e) => e.target.select()}
                />

                <SearchableSelect
                    label="Branch Name"
                    options={branchList}
                    value={branch}
                    onChange={setBranch}
                    placeholder="Select Branch"
                    disabled={!bankType || !bank}
                    onFocus={(e) => e.target.select()}
                />

                <div>
                    <label className="block text-sm font-medium mb-1">Account Number</label>
                    <input
                        type="text"
                        name="account_number"
                        value={accno}
                        onChange={(e) => setAccno(e.target.value)}
                        placeholder="Enter your account number"
                        className="w-full border-0 border-b-1 border-gray-500 bg-transparent focus:border-cyan-200 focus:ring-0 focus:outline-none placeholder-gray-400 text-white"
                        required
                    />
                </div>

                {/* Submit Button */}
                
            </div>

            <button
                type="button"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-400/60 to-red-500/60 hover:from-amber-400/80 hover:to-red-500/80 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900"
                onClick={handleBankUpdate}
            >
                {loading ? 
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
                            <span>Updating ...</span>
                        </div>
                    )  : 'Submit'
                }
            </button>
        </div>
    )
}

export default ChangeBank
