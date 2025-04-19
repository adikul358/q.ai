import { NextResponse } from "next/server"
import { deleteFiles } from "@/lib/openAI"

export const GET = async () => {
    try {
        const files = await deleteFiles()
        return NextResponse.json({ files, status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ status: 500 })
    }
}