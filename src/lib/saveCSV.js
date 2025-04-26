"use server"
import path from "path";
import { writeFile, stat } from "fs/promises"
import Papa from "papaparse";

export async function saveCSV(csvData, taskId) {
    const csvHeader = "Test case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category"
    let csvRes = `${csvHeader}\n`
    for (const c of csvData) {
        const csvMatch = c.match(/^```csv\nTest case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category\n([\S\s]+)```/)
        if (csvMatch) {
            csvRes += csvMatch[1]
        } else {
            csvRes += c.substring(7, v.length - 5)
        }
    }

    const parsed = Papa.parse(csvRes.trim(), {
        header: false,
        skipEmptyLines: true,
    });

    // Serialise CSV
    const tableData = parsed.data;
    const serialisedData = []
    for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i]
        if (i == 0) { serialisedData.push(row) }
        serialisedData.push([`TD_${String(i).padStart(3, '0')}`, ...row.slice(1)])
    }
    const serialisedCSV = Papa.unparse(serialisedData)

    const filename = `test_cases_${taskId}.csv`
    const pathname = path.resolve(process.cwd(), `public/csv/${filename}`)
    try {
        await writeFile(pathname, serialisedCSV, 'utf8')
        const sizeBytes = (await stat(pathname)).size;
        return { name: filename, url: `/csv/${filename}`, size: sizeBytes }
    } catch (err) {
        console.log(err)
    }
}
export async function getCSV(taskId) {
    const filename = `test_cases_${taskId}.csv`
    const pathname = path.resolve(process.cwd(), `public/csv/${filename}`)

    try {
        const sizeBytes = (await stat(pathname)).size;
        console.log({ name: filename, url: `/csv/${filename}`, size: sizeBytes })
        return { name: filename, url: `/csv/${filename}`, size: sizeBytes }
    } catch (err) {
        console.log(err)
    }
}