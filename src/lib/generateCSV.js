"use server"
import OpenAI from "openai"
import { getAssistant, uploadFiles } from "./openAI"

const openai = new OpenAI()

export default async function generateCSV(queries, files) {
    // Get assistant
    const asstCSVGenerator = await getAssistant("csv_generator")
    console.log(asstCSVGenerator)

    const figmaUploadIds = await uploadFiles(files)

    // Run csv_generator
    const csvRuns = []
    const csvResponses = []
    // for (const q of queries.slice(0,2)) {
    for (const q of queries) {
        const thread = await openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: [{
                    "type": "text",
                    "text": q
                },
                ...figmaUploadIds.map(v => {
                    return {
                        "type": "image_file",
                        "image_file": { "file_id": v }
                    }
                })]
            }
        );
        const run = openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: asstCSVGenerator.id }
        );
        csvRuns.push(run)
    }

    // Process CSV
    const csvCompletedRuns = await Promise.all(csvRuns)
    const csvUsageTotal = {}
    for (const run of csvCompletedRuns) {
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(run.thread_id);
            const csvRes = messages.data[0].content[0].text.value
            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
            }
            csvResponses.push(csvRes)
            // Aggregate token usage data
            for (const key in run.usage) {
                if (typeof run.usage[key] === "number") {
                    if (csvUsageTotal[key]) {
                        csvUsageTotal[key] += run.usage[key]
                    } else {
                        csvUsageTotal[key] = run.usage[key]
                    }
                }
            }
            console.log({ csvUsage: run.usage })
        } else {
            console.log(run.status);
        }
        console.log({ csvUsageTotal })
    }
    
    return {asstCSVGenerator, figmaUploadIds, csvUsageTotal, csvResponses}
}