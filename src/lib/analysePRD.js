"use server"
import OpenAI from "openai"
import { getAssistant, uploadFiles } from "./openAI"

const openai = new OpenAI()

export default async function analysePRD(file) {
    // // TESTING ONLY
    // prdUploadId = "file-2yFF7te7p96nBWVwi15iAF"
    // figmaUploadIds = ["file-F9Vqu5jGR53xNDuopofJAZ", "file-Kub2wdaZBs2DMB49vKty1G", "file-4PCNy2FXdsrZucF8NPPn15"]
    // asstPRDAnalyser = {id: "asst_5F42krSmagT2ihX5jblxsCLV"}
    // asstCSVGenerator = {id: "asst_DSzHN7KxThbVV2WtVI2f3Wbp"}

    // Get assistant
    const asstPRDAnalyser = await getAssistant("prd_analyser")
    console.log(asstPRDAnalyser)

    const prdUploadId = (await uploadFiles([file]))[0]
    let prdRes = ""

    // Run prd_analyser
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: "This is my PRD, give me the required json.",
            attachments: [{ file_id: prdUploadId, tools: [{ type: "file_search" }] }]
        }
    );
    const run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        { assistant_id: asstPRDAnalyser.id }
    );
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        prdRes = messages.data[0].content[0].text.value
        for (const message of messages.data.reverse()) {
            console.log(`${message.role} > ${message.content[0].text.value}`);
        }
        console.log({ prdUsage: run.usage })
    } else {
        console.log(run.status);
    }

    // Process JSON
    const queries = []
    const start = prdRes.indexOf('{');
    const end = prdRes.lastIndexOf('}');
    if (start === -1 || end === -1 || start > end) {
      throw new Error('No valid JSON block found.');
    }
    const jsonString = prdRes.slice(start, end + 1);
    const { test_areas, ...suppInfo } = JSON.parse(jsonString)
    let i = 1
    for (const t of test_areas) {
        const query = `${JSON.stringify({test_area: t, ...suppInfo}, null, 2)}\n\nGenerate test cases from this information and the given Image, give the data in csv format.`
        queries.push(query)
        console.log(`\n\nQuery ${i} =====\n${query}`)
        i++
    }
    
    return {asstPRDAnalyser, prdUploadId, queries, prdRes}
}