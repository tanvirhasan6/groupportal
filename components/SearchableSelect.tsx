'use client'
import React, { useState, useRef, useEffect } from 'react'

interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    label?: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
}

export default function SearchableSelect({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
}: SearchableSelectProps) {
    const [query, setQuery] = useState('')
    const [showOptions, setShowOptions] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filteredOptions = options.filter((opt) =>
        opt?.label?.toLowerCase().includes(query?.toLowerCase())
    )

    useEffect(() => {
        const selected = options.find((opt) => opt.value === value)
        if (selected) setQuery(selected.label)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setShowOptions(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (opt: Option) => {
        onChange(opt.value)
        setQuery(opt.label)
        setShowOptions(false)
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            
            {label && <label className="block text-sm text-gray-300 mb-1">{label}</label>}

            <input
                type="text"
                value={query}
                onFocus={() => !disabled && setShowOptions(true)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full border-b border-gray-600 bg-gray-700 text-white px-2 py-1 rounded-t-md focus:outline-none ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-cyan-400'
                }`}
            />

            {!disabled && showOptions && (
                <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-b-md mt-1 max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                    <li className="px-2 py-1 text-gray-400">No results found</li>
                ) : (
                    filteredOptions.map((opt) => (
                    <li
                        key={opt.value}
                        onClick={() => handleSelect(opt)}
                        className={`px-2 py-1 cursor-pointer hover:bg-cyan-600 ${
                        value === opt.value ? 'bg-cyan-800' : ''
                        }`}
                    >
                        {opt.label}
                    </li>
                    ))
                )}
                </ul>
            )}
        </div>
    )
}
