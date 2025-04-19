"use server"
import { writeFile, stat } from "fs/promises"

export default async function saveCSV(csvData, taskId) {
    const csvHeader = "Test case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category"
    let csvRes = `${csvHeader}\n`
    for (const c of csvData) {
        csvRes += c.match(/^```csv\nTest case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category\n([\S\s]+)```/)[1]
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