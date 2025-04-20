"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Navbar() {
    const { data: session, status } = useSession()

    useEffect(() => {console.log(session)}, [session])

    return (
        <nav className="absolute w-screen top-0 ">
            <div className="max-w-7xl flex items-center p-3 justify-end mx-auto">
                <pre className="whitespace-pre-wrap text-blue-800 text-sm w-full">{session ? JSON.stringify(session.user, null, 1) : "signed out"}</pre>
            </div>
        </nav>
    )
}