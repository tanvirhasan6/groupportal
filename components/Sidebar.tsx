export type SidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {

    return (
        <aside className={`h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden flex flex-col z-40`}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Zenith_Bank_logo.svg"
                        alt="Company Logo"
                        className="w-8 h-8"
                    />
                    <h2 className={`text-xl font-semibold text-cyan-400 ${sidebarOpen ? "" : "hidden"}`}>
                        Zenith Life
                    </h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-4 space-y-2 text-gray-300">
                <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-cyan-400">
                Dashboard
                </button>
                <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-cyan-400">
                Policies
                </button>
                <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-cyan-400">
                Claims
                </button>
                <button className="text-left px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-cyan-400">
                Reports
                </button>
            </nav>

        </aside>
    )
}