"use server"
import path from "path"
import { writeFile, mkdir } from "fs/promises"
import { v4 as uuidv4 } from 'uuid'

export default async function uploadFiles(formData) {
    const uuid = uuidv4()
    console.log(`Generated UUID ${uuid}`)

    
    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir);
      console.log('Uploads directory is ready. ' + uploadsDir);
    } catch (err) {
      console.error('Failed to create uploads directory:', err.message);
    }

    // Handle PRD File
    const filePRD = formData.get("filePRD")
    if (!filePRD) {
        return NextResponse.json({ error: "No PRD file received." }, { status: 400 })
    }
    let buffer = Buffer.from(await filePRD.arrayBuffer())
    let filename = `${uuid}_prd${path.extname(filePRD.name)}`
    console.log(`Saving PRD File: ${filename}`)
    try {
        await writeFile(path.join(process.cwd(), "uploads/" + filename), buffer)
        console.log(`Saved PRD: /uploads/${filename}`)
    } catch (error) {
        console.log("Error occurred ", error)
        return { error }
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
            console.log(`Saving Figma File: ${filename}`)
            await writeFile(path.join(process.cwd(), "uploads/" + filename), buffer)
            console.log(`Saved Figma: /uploads/${filename}`)
            i++
        }
        return { taskId: uuid }
    } catch (error) {
        console.log("Error occurred ", error)
        return { error }
    }
}