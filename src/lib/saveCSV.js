"use server"
import { writeFile, stat } from "fs/promises"

export async function saveCSV(csvData, taskId) {
    const csvHeader = "Test case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category"
    let csvRes = `${csvHeader}\n`
    for (const c of csvData) {
        const csvMatch = c.match(/^```csv\nTest case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category\n([\S\s]+)```/)
        if (csvMatch) {
            csvRes += csvMatch[1]
        } else {
            csvRes += c.substring(7, v.length-5)
        }
    }
    // TODO: Fix Numbers

    const filename = `test_cases_${taskId}.csv`
    const pathname = `public/${filename}`

    try {
        await writeFile(pathname, csvRes, 'utf8')
        const sizeBytes = (await stat(pathname)).size;
        return {name: filename, url: `/${filename}`, size: sizeBytes}
    } catch (err) {
        console.log(err)
    }
}
export async function getCSV(taskId) {
    const filename = `test_cases_${taskId}.csv`
    const pathname = `public/${filename}`

    try {
        const sizeBytes = (await stat(pathname)).size;
        console.log({name: filename, url: `/${filename}`, size: sizeBytes})
        return {name: filename, url: `/${filename}`, size: sizeBytes}
    } catch (err) {
        console.log(err)
    }
}