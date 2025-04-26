"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { addUser } from "@/lib/postgres"

export default function Navbar() {
    const router = useRouter()
    const { data: session, status } = useSession()

    useEffect(() => {
        console.log({session})
        setUsername(session ? session.user.name : "Guest")
    }, [session])

    const [showHowToUse, setShowHowToUse] = useState(false)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const [username, setUsername] = useState('') // Default name
    const dropdownRef = useRef(null)

    useEffect(() => {
        setUsername(session ? session.user.name : "Guest")
        if (session && session.user) {
            addUser(session.user)
        }
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [])

    const handleSignIn = async () => { await signIn("google") }
    const handleSignOut = async () => {
        await signOut()
        setShowProfileDropdown(false)
    }

    const handleHistory = () => { router.push('/history') }
    const handleHome = () => { router.push('/') }

    return (
        // <nav className="absolute w-screen top-0 ">
        //     <div className="max-w-7xl flex items-center p-3 justify-end mx-auto">
        //         <pre className="whitespace-pre-wrap text-blue-800 text-sm w-full">{session ? JSON.stringify(session.user, null, 1) : "signed out"}</pre>
        //     </div>
        // </nav>

        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b border-gray-100 absolute w-screen top-0 z-10">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHome}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-extrabold shadow-lg transition-transform hover:scale-105 cursor-pointer">
                    <span>Q</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-semibold text-gray-800">Qai</span>
                    <span className="text-sm text-gray-500">AI Test Generator</span>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* <button
                    className={`flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg transition-all duration-200 ${showHowToUse
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-100 hover:text-gray-800'
                        }`}
                    onClick={() => setShowHowToUse(!showHowToUse)}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 13.5C11.9816 13.1754 12.0692 12.8536 12.2495 12.5833C12.4299 12.313 12.6933 12.1091 13 12C13.3759 11.8563 13.7132 11.6279 13.9856 11.3336C14.2579 11.0392 14.4577 10.6866 14.5693 10.3056C14.6809 9.92465 14.7013 9.52614 14.6287 9.1363C14.5562 8.74646 14.3926 8.37931 14.1513 8.06585C13.91 7.75239 13.5979 7.50128 13.2402 7.33262C12.8825 7.16396 12.4894 7.08267 12.0913 7.09372C11.6932 7.10478 11.3051 7.20786 10.9574 7.39525C10.6097 7.58264 10.3116 7.84908 10.0875 8.17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium">How to Use</span>
                </button>

                {session && (
                    <button
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                        onClick={handleHistory}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.05078 11.0002C3.27441 8.18983 4.51578 5.54696 6.53904 3.67405C8.56231 1.80115 11.2128 0.851345 13.9328 1.01261C16.6528 1.17388 19.1747 2.43107 20.9645 4.51686C22.7544 6.60266 23.6577 9.33614 23.4728 12.0992C23.2878 14.8623 22.0287 17.4477 19.9516 19.3186C17.8745 21.1894 17.1397 22.1803 12.3197 22.0815C9.49969 21.9828 6.85298 20.7401 4.99289 18.6249C3.1328 16.5097 2.2135 13.7557 2.39878 10.9902" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm font-medium">History</span>
                    </button>
                )} */}

                {/* <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 5L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-medium">Generate</span>
                </button> */}

                <div className="relative" ref={dropdownRef}>
                    {session ? (
                        <button
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            aria-expanded={showProfileDropdown}
                            aria-label="Toggle profile menu"
                        >
                            {session.user.image ? 
                                <img src={session.user.image} className="w-8 h-8 rounded-full overflow-hidden" />
                            : 
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                                    {username.charAt(0)} {/* Show first letter of name as avatar */}
                                </div>
                            }
                            <span className="text-sm font-medium">{username}</span>
                            <svg className={`w-4 h-4 transform transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
                                onClick={handleSignIn}
                            >
                                <span className="text-sm font-medium">Login</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200"
                                onClick={handleSignIn}
                            >
                                <span className="text-sm font-medium">Signup</span>
                            </button>
                        </div>
                    )}
                    {showProfileDropdown && session && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20">
                            <span href="#" className="block px-4 py-2 text-sm text-sky-800/75 border-gray-100 border-b" onClick={() => setShowProfileDropdown(false)} >
                                {session.user.email}
                            </span>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileDropdown(false)} >
                                Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleSignOut} >
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

