"use client"

import { createContext } from 'react';

export const TaskContext = createContext({
    taskId: "",
    files: {
        prd: "",
        figma: [""]
    }
})

export const TaskContextProvider = ({children, value}) => {
    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
}
export const UserContext = createContext({
    email: "",
    isSignedIn: false,
    name: "",
    avatarUrl: ""
})

export const UserContextProvider = ({children, value}) => {
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}