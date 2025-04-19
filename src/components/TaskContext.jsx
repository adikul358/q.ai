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