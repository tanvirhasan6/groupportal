'use client'
import { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

const page = () => {

    const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([])
    const [testFiles, setTestFiles] = useState<File[]>([])
    const [receiptFiles, setReceiptFiles] = useState<File[]>([])

    const allSelectedFiles = [
        ...prescriptionFiles,
        ...testFiles,
        ...receiptFiles,
    ]

    const [formData, setFormData] = useState({
        coverage: '',
        date: '',
        claimType: '',
        disease: '',
        hospital: '',
        amount: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
    }

    const FileInput = ({
        label,
        files,
        setFiles,
    }: {
        label: string
        files: File[]
        setFiles: React.Dispatch<React.SetStateAction<File[]>>
    }) => {
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const newFiles = Array.from(e.target.files).filter(
            (file) => !allSelectedFiles.some((f) => f.name === file.name)
        )
        setFiles([...files, ...newFiles])
        e.target.value = '' // reset input so same file can be selected if removed
        }

        const removeFile = (fileName: string) => {
        setFiles(files.filter((f) => f.name !== fileName))
        }

        return (
        <div className="border border-white/20 rounded-xl p-4 bg-gray-900/40 hover:bg-gray-900/60 transition">
            <label className="block text-sm mb-2 text-gray-300">{label}</label>
            <div className="flex items-center gap-4">
            <FaCloudUploadAlt className="text-cyan-400 text-2xl" />
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file:bg-cyan-600 file:hover:bg-cyan-700 file:border-0 
                        file:rounded-md file:px-4 file:py-1 file:text-white 
                        text-gray-400 text-sm cursor-pointer"
            />
            </div>
            <ul className="mt-2">
            {files.map((file) => (
                <li
                key={file.name}
                className="flex justify-between items-center mt-1 bg-gray-800 p-2 rounded"
                >
                <span>{file.name}</span>
                <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:text-red-700 font-bold"
                >
                    ✕
                </button>
                </li>
            ))}
            </ul>
        </div>
        )
    }

    return (
        <div className="w-full min-h-screen text-white flex justify-center items-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8"
            >
                <h1 className="text-center text-3xl font-semibold text-cyan-400">
                New Claim
                </h1>

                {/* Grid inputs */}
                <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                    Coverage Period
                    </label>
                    <select
                    name="coverage"
                    value={formData.coverage}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                    <option value="">Select</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                    Consult/Treatment Date
                    </label>
                    <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">Claim Type</label>
                    <select
                    name="claimType"
                    value={formData.claimType}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                    <option value="">Select Claim Type</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="indoor">Indoor</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">Amount</label>
                    <input
                    type="number"
                    name="amount"
                    placeholder="Enter Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">Disease</label>
                    <select
                    name="disease"
                    value={formData.disease}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                    <option value="">Select Disease</option>
                    <option value="fever">Fever</option>
                    <option value="flu">Flu</option>
                    <option value="injury">Injury</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">Hospital</label>
                    <select
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                    <option value="">Select Hospital</option>
                    <option value="square">Square</option>
                    <option value="apollo">Apollo</option>
                    <option value="labaid">Labaid</option>
                    </select>
                </div>
                </div>

                {/* File upload sections */}
                <div className="grid md:grid-cols-2 gap-6">
                    <FileInput
                        label="Prescription Files"
                        files={prescriptionFiles}
                        setFiles={setPrescriptionFiles}
                    />
                    <FileInput
                        label="Medical Test Files"
                        files={testFiles}
                        setFiles={setTestFiles}
                    />
                    <FileInput
                        label="Money Receipt / Bill / Invoice Files"
                        files={receiptFiles}
                        setFiles={setReceiptFiles}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-8 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md shadow-md transition-all hover:scale-105"
                    >
                        Apply
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page
