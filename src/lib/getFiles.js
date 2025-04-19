"use server"
import { readdir } from "fs/promises"

export default async function getFiles(uuid) {
    try {
        const regexPRD = new RegExp(`^${uuid}_prd.pdf$`, 'i');
        const regexFigma = new RegExp(`^${uuid}_figma_\\d+\\.(png|jpg|jpeg)$`, 'i');
        const files = await readdir("uploads")
        const filePRD = files.filter((file) => regexPRD.test(file))
        const filesFigma = files.filter((file) => regexFigma.test(file))

        console.log({filePRD: filePRD[0], filesFigma})
        return {prd: filePRD[0], figma: filesFigma}
    } catch (err) {
        console.error("Error reading directory:", err)
        return []
    }
}