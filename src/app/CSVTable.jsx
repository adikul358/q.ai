"use client"
import Papa from "papaparse";

export default function CSVTable({ csvData }) {
    let csvRes = "Test case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category\n"

    for (const c of csvData) {
        csvRes += c.match(/^```csv\nTest case id,Title,Description,Pre-conditions,Test steps,Expected results,ETA,Priority,Test type,Env,Screen,Verified,Category\n([\S\s]+)```/)[1]
    }

    const parsed = Papa.parse(csvRes.trim(), {
        header: false,
        skipEmptyLines: true,
      });
    
    const tableData = parsed.data;
    
    console.log(csvRes)

    return (
        <div className="overflow-autow">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100 font-medium">
                    <tr>
                        {tableData[0].map((header, idx) => (
                            <th key={idx} className="border px-4 py-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-blue-300/30 transition-colors ease-in">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border px-4 py-2">
                                    {cellIndex == 0 ? `TD_${String(rowIndex + 1).padStart(3, '0')}` : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}