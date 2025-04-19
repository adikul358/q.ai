import { TaskContextProvider } from "@/components/TaskContext";
import getFiles from "@/lib/getFiles";

export default async function TaskLayout({ children, params }) {
    const taskId = (await params).id
    const files = await getFiles(taskId)

    return (
        <div>
            <TaskContextProvider value={{taskId, files}}>
                {children}
            </TaskContextProvider>
        </div>
    );
}
