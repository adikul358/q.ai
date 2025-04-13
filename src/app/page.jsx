"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

const getStatusProps = (status, files) => {
    switch (status) {
        case "progress":
            return {
                class: "upload-progress",
                component: <>
                    <img src="upload_progress.svg" key="progress" alt="upload_progress" className="fade-up w-28 mb-4" />
                    <p className="fade-up text-lg font-semibold">Uploading...</p>
                </>
            }
        case "success":
            return {
                class: "upload-success",
                component: <>
                    <img src="upload_success.svg" key="success" alt="upload_success" className="fade-up w-28 mb-4" />
                    <p className="fade-up text-lg font-semibold mb-3">Uploaded</p>
                    {files && <p className="">{files.map(v => v.name).join(", ")}</p>}
                </>
            }
        default:
            return {
                class: "border-gray-300 bg-gray-100/50",
                component: <>
                    <img src="upload.svg" alt="upload" className="w-28 mb-4" />
                    <p className="text-lg font-semibold">Drag & Drop File</p>
                    <p className="text-lg mb-3">or Select File</p>
                    <p className="text-sm">Max Size: 100 MB</p>
                </>
            }
    }
}

export default function Home() {
    const router = useRouter()

    const [dragOverStatus, setDragOverStatus] = useState({ prd: false, figma: false })
    const [uploadStatus, setUploadStatus] = useState({ prd: "", figma: "" })
    const [submitStatus, setSubmitStatus] = useState(false)

    const [files, setFiles] = useState({ prd: null, figma: null })

    const handleDragOver = (event, field) => {
        event.preventDefault()
        setDragOverStatus(s => { return { ...s, ...{ [field]: true } } })
    }
    const handleDrop = (event, field) => {
        event.preventDefault()
        setDragOverStatus(s => { return { ...s, ...{ [field]: false } } })
        const droppedFiles = event.dataTransfer.files
        if (droppedFiles.length > 0) {
            const newFiles = Array.from(droppedFiles)
            setFiles(s => { return { ...s, ...{ [field]: newFiles } } })
            setUploadStatus(s => { return { ...s, ...{ [field]: "progress" } } })
            setTimeout(_ => setUploadStatus(s => { return { ...s, ...{ [field]: "success" } } }), 1500)
        }
    }

    const uploadFiles = async () => {
        setSubmitStatus(true)
        const form = new FormData();
        form.append('filePRD', files.prd[0]);
        for (const f in files.figma) {
            form.append('filesFigma', f);
        }
        // TESTING ONLY
        for (const value of formData.values()) {
            console.log(value);
        }

        try {
            const res = await fetch("/api/upload", { method: "POST", body: form });
            const data = await res.json();
            console.log(data);
            if (data.uuid) {
                router.push(`/task/${data.uuid}`)
            }
        } catch (error) {
            console.error(error);
        }
    }

    // TESTING ONLY
    useEffect(() => {
        console.dir(files)
    }, [files])

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center max-w-4xl w-full text-gray-600">

                <h1 className="text-xl font-semibold mb-6">Upload Files</h1>

                <div className="w-full bg-[#FFF1FB] rounded-lg flex flex-col mb-12 overflow-hidden outline-1 outline-[#FA4EA9]">
                    <p className="font-semibold text-center bg-[#FA4EA9] text-white/90 py-1">Accepted Types</p>
                    <div className="w-full rounded-lg grid grid-cols-3 gap-x-3 py-4 px-12">
                        <div className="w-full space-x-3 flex items-center">
                            <div className="w-16 aspect-square bg-[#FA4EA9] rounded-full flex items-center justify-center p-4">
                                <img src="types_images.svg" alt="types_images" className="w-full" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-700">Images</p>
                                <p className=" text-gray-700">PNG, JPG</p>
                            </div>
                        </div>
                        <div className="w-full space-x-3 flex items-center">
                            <div className="w-16 aspect-square bg-[#FA4EA9] rounded-full flex items-center justify-center p-4">
                                <img src="types_gifs.svg" alt="types_gifs" className="w-full" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-700">GIFs</p>
                                <p className=" text-gray-700">Up to 800x600</p>
                            </div>
                        </div>
                        <div className="w-full space-x-3 flex items-center">
                            <div className="w-16 aspect-square bg-[#FA4EA9] rounded-full flex items-center justify-center p-3">
                                <img src="types_videos.svg" alt="types_videos" className="w-full" />
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-700">Videos</p>
                                <p className=" text-gray-700">MP4, Up to 24s</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg grid grid-cols-2 gap-x-3 mb-12">
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-center mb-3">Upload PRD</p>
                        <div
                            onDrop={e => handleDrop(e, "prd")}
                            onDragOver={e => handleDragOver(e, "prd")}
                            onDragLeave={_ => setDragOverStatus(s => { return { ...s, ...{ prd: false } } })}
                            className={`${dragOverStatus.prd ? "justify-center border-solid bg-[#FFF1FB] border-[#FA4EA9]" : `border-dashed ${getStatusProps(uploadStatus.prd).class}`} text-center transition-colors duration-200 ease-out h-[380px] border-4 rounded-lg flex flex-col items-center p-12`}
                        >
                            {dragOverStatus.prd ? (
                                <>
                                    <img src="upload.svg" alt="upload" className="fade-up w-28 mb-4" />
                                    <p className="fade-up text-lg font-semibold">Drag & Drop File</p>
                                </>
                            ) : (
                                <>
                                    <img src="upload_files.svg" alt="upload" className="w-32 mb-2 opacity-50" />
                                    {getStatusProps(uploadStatus.prd, files.prd).component}
                                </>
                            )}

                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-center mb-3">Upload Figma</p>
                        <div
                            onDrop={e => handleDrop(e, "figma")}
                            onDragOver={e => handleDragOver(e, "figma")}
                            onDragLeave={_ => setDragOverStatus(s => { return { ...s, ...{ figma: false } } })}
                            className={`${dragOverStatus.figma ? "justify-center border-solid bg-[#FFF1FB] border-[#FA4EA9]" : `border-dashed ${getStatusProps(uploadStatus.figma).class}`} transition-colors duration-200 ease-out h-[380px] border-4 rounded-lg flex flex-col items-center p-12`}
                        >
                            {dragOverStatus.figma ? (
                                <>
                                    <img src="upload.svg" alt="upload" className="fade-up w-28 mb-4" />
                                    <p className="fade-up text-lg font-semibold">Drag & Drop File</p>
                                </>
                            ) : (
                                <>
                                    <img src="upload_files.svg" alt="upload" className="w-32 mb-2 opacity-50" />
                                    {getStatusProps(uploadStatus.figma, files.figma).component}
                                </>
                            )}

                        </div>
                    </div>
                </div>

                <input type="file" className="hidden" />

                <button onClick={uploadFiles} className={`${!submitStatus ? "bg-[#FA4EA9]" : "progress"} cursor-pointer px-8 py-4 text-white font-semibold text-lg rounded-lg w-[251px]`}>
                    <span>{!submitStatus ? "Generate Test Cases" : "Generating..."}</span>
                </button>


            </div>
        </div>
    )
}
