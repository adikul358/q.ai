// Import necessary modules
import { NextResponse } from "next/server"
import path from "path"
import { writeFile } from "fs/promises"
import { v4 as uuidv4 } from 'uuid'

export const POST = async (req, res) => {
    const formData = await req.formData()
    const uuid = uuidv4()
    console.log(`Generated UUID ${uuid}`)

    // Handle PRD File
    const filePRD = formData.get("filePRD")
    if (!filePRD) {
        return NextResponse.json({ error: "No PRD file received." }, { status: 400 })
    }
    let buffer = Buffer.from(await filePRD.arrayBuffer())
    let filename = `${uuid}_prd${path.extname(filePRD.name)}`
    console.log(`Saving PRD File: ${filename}`)
    try {
        await writeFile(
            path.join(process.cwd(), "uploads/" + filename),
            buffer
        )
        console.log(`Saved PRD: /uploads/${filename}`)
    } catch (error) {
        console.log("Error occurred ", error)
        return NextResponse.json({ Message: "Failed", status: 500 })
    }
    
    // Handle Figma files
    const filesFigma = formData.getAll("filesFigma")
    if (!filesFigma || filesFigma.length == 0) {
        return NextResponse.json({ error: "No Figma file(s) received." }, { status: 400 })
    }
    try {
        let i = 1
        for (const file of filesFigma) {
            buffer = Buffer.from(await file.arrayBuffer())
            filename = `${uuid}_figma_${i}${path.extname(file.name)}`
            console.log(`Saving PRD File: ${filename}`)
            await writeFile(
                path.join(process.cwd(), "uploads/" + filename),
                buffer
            )
            i++
        }
        return NextResponse.json({ Message: "Success", status: 201, uuid })
    } catch (error) {
        console.log("Error occurred ", error)
        return NextResponse.json({ Message: "Failed", status: 500 })
    }

}