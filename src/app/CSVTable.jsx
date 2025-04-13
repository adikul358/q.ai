"use client"
import CsvToHtmlTable from "react-csv-to-table"

export default function CSVTable({ csvRes }) {
    const rows = csvRes.trim().split("\n");
    const tableData = rows.map((row) => row.split(","));

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
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}