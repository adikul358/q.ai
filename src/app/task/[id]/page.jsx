"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { Grid } from "react-loader-spinner"
import Modal from 'react-modal';

export default function Home() {
    const router = useRouter()

    const [downloadTrigger, setDownloadTrigger] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [authModal, setAuthModal] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [statusMsg, setStatusMsg] = useState("Analysing PRD...")
    const [progressBar, setProgressBar] = useState(10)

    const downloadFile = () => { 
        const a = document.createElement('a');
        a.href = "/test_cases_8e1a0183-a966-49f1-8c18-17e74ce3d444.csv";
        a.download = 'test_cases_8e1a0183-a966-49f1-8c18-17e74ce3d444.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => setAuthModal(false), 2000)
    }

    const AuthModal = () => {
        return (
            <Modal
                isOpen={authModal}
                onRequestClose={() => setAuthModal(false)}
                overlayClassName="fade-in h-screen w-screen absolute inset-0 bg-white/30 backdrop-blur flex items-center justify-center"
                className="fade-up w-full max-w-2xl rounded-xl flex flex-col items-center text-center bg-white p-12 outline-[#FA4EA9] outline-1"
            >
                <h2 className="text-xl font-semibold mb-12">Create an account to download test cases</h2>
                <button onClick={() => { setLoggedIn(true);downloadFile() }} className="cursor-pointer w-max flex items-center px-10 py-3 rounded-lg outline-1 outline-gray-600">
                    <img src="/google.svg" alt="google icon" className="h-6 mr-3" />
                    <span>Sign up with Google</span>
                </button>
                <p className="mt-4">Already have an account? <a className="underline font-semibold">Sign in</a></p>
            </Modal>
        )
    }

    useEffect(() => {
        if (!completed) {
            setTimeout(() => setProgressBar(100), 2500)
            setTimeout(() => setProgressBar(5), 3000)
            setTimeout(() => setStatusMsg("Generating Test Cases..."), 3000)
            setTimeout(() => setProgressBar(100 / 6), 10500)
            setTimeout(() => setProgressBar(100 / 6 * 2), 18000)
            setTimeout(() => setProgressBar(100 / 6 * 3), 25500)
            setTimeout(() => setProgressBar(100 / 6 * 4), 33000)
            setTimeout(() => setProgressBar(100 / 6 * 5), 40500)
            setTimeout(() => setProgressBar(100), 47500)
            setTimeout(() => setProgressBar(10), 48000)
            setTimeout(() => setStatusMsg("Compiling CSV..."), 48000)
            setTimeout(() => setProgressBar(100), 48500)
            setTimeout(() => setCompleted(true), 49500)
            
            // setTimeout(() => setProgressBar(100), 4500)
            // setTimeout(() => setProgressBar(10), 5000)
            // setTimeout(() => setStatusMsg("Compiling CSV..."), 5000)
            // setTimeout(() => setProgressBar(100), 5500)
            // setTimeout(() => setCompleted(true), 5800)
        }
    }, [])


    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center max-w-4xl w-full text-gray-600">

                {!completed ?
                    <>
                        <Grid visible={true} height="80" width="80" color="#FA4EA9" ariaLabel="grid-loading" radius="12.5" wrapperStyle={{}} wrapperClass="grid-wrapper" />
                        <Progress value={progressBar} className="max-w-xl my-8 [&>*]:bg-[#FA4EA9] bg-[#FA4EA9]/25" />
                        <h1 className="text-2xl font-semibold mb-3">{statusMsg}</h1>
                        <p className="font-semibold mb-6 text-gray-500">Please don’t go back or close the window while the page is loading</p>
                    </>
                    :
                    (downloadTrigger && loggedIn) ? (
                        <div className="w-full rounded-xl flex flex-col items-center text-center upload-success border-4 p-12">
                            <img src="/checkmark.svg" alt="checkmark icon" className="h-32 mb-6" />
                            <h1 className="text-4xl font-semibold mb-3">Download Successful!</h1>
                            <p className="text-lg mb-3 text-gray-500">Your CSV file has been downloaded successfully</p>
                            <p className="mb-12 text-gray-500 font-mono">test_cases_8e1a0183-a966-49f1-8c18-17e74ce3d444.csv (31 KB)</p>

                            <div className="flex space-x-3">
                                <button onClick={() => router.replace("/")} className="bg-[#FA4EA9] mr-12 cursor-pointer px-8 py-4 text-white font-semibold text-lg rounded-lg w-[251px]">
                                    <span>← Back to Home</span>
                                </button>
                                <button className="bg-[#FA4EA9] cursor-pointer px-4 py-4 text-white font-semibold text-lg rounded-lg">
                                    <img src="/share.svg" alt="" className="h-8 aspect-square" />
                                </button>
                                <button className="bg-[#FA4EA9] cursor-pointer px-4 py-4 text-white font-semibold text-lg rounded-lg">
                                    <img src="/google_drive.svg" alt="" className="h-8 aspect-square" />
                                </button>
                                <button className="bg-[#FA4EA9] cursor-pointer px-4 py-4 text-white font-semibold text-lg rounded-lg">
                                    <img src="/whatsapp.svg" alt="" className="h-8 aspect-square" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full rounded-xl flex flex-col items-center text-center border-[#FA4EA9] border-4 bg-[#FFF1FB] p-12">
                            <img src="/download.svg" alt="cloud_download icon" className="h-64" />
                            <h1 className="text-4xl font-semibold mb-3">Generation Successful!</h1>
                            <p className="text-lg mb-3 text-gray-500">Your CSV file has been generated successfully</p>
                            <p className="mb-12 text-gray-500 font-mono">test_cases_8e1a0183-a966-49f1-8c18-17e74ce3d444.csv (31 KB)</p>

                            <button onClick={() => { setDownloadTrigger(true); setAuthModal(!loggedIn) }} className={`bg-[#FA4EA9] cursor-pointer px-8 py-4 text-white font-semibold text-lg rounded-lg w-[251px]`}>
                                <span>Download</span>
                            </button>
                        </div>
                    )
                }

                {(downloadTrigger && !loggedIn) && <AuthModal />}



            </div>
        </div>
    )
}
