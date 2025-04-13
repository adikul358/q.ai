import CSVTable from "@/app/CSVTable";
import getFiles from "@/lib/getFiles"
import { createReadStream } from "fs"
import OpenAI from "openai"

const openai = new OpenAI()

const assistantPrompts = {
    "prd_analyser": "You are a helpful assistant that acts as QA tester for apps and helps extract the most important functionalities of the app from a PRD document in the form of a PDF attachment. Frame your response in numbered markdown with no text before or after the list.",

    "csv_generator": "You are a helpful assistant that helps extract the important test cases for a software based on the main requirements and from images of the UI made in Figma. Frame your response in csv format with no text before or after the csv. The columns should be ⁠Test case id, ⁠Title, ⁠Description, ⁠Pre-conditions, ⁠Test steps, ⁠Expected results, ⁠ETA, ⁠Priority, ⁠Test type, ⁠Env, ⁠Screen, ⁠Verified, ⁠Category. Generate around 50 test cases."
}

const getAssistant = async (name) => {
    const myAssistants = await openai.beta.assistants.list();

    const asst = myAssistants.data.find(v => v.name == name)

    if (!asst) {
        switch (name) {
            case "prd_analyser":
                await openai.beta.assistants.create({
                    instructions: assistantPrompts.prd_analyser,
                    name: name,
                    model: "gpt-4o-mini",
                })
                break
            case "csv_generator":
                await openai.beta.assistants.create({
                    instructions: assistantPrompts.csv_generator,
                    name: name,
                    model: "gpt-4.5-preview-2025-02-27",
                })
                break
            default:
                throw new Error("Wrong Assistant Name Given")
        }
    } else {
        return asst
    }
}

const uploadFiles = async (files) => {
    const res = []
    for (let f of files) {
        f = `uploads/${f}`
        try {
            const file = await openai.files.create({
                file: createReadStream(f),
                purpose: "user_data",
            });

            console.log(`Uploaded file ${f}`);
            console.log(file);
            res.push(file.id)
        } catch (e) {
            console.log(`Error ${e}`)
        }
    }
    return res
}

// TESTING ONLY
const deleteFiles = async () => {
    const list = await openai.files.list();

    for await (const f of list) {
        const file = await openai.files.del(f.id);
        console.log(file)
    }
}

export default async function Page({ params }) {
    const taskUUID = (await params).id
    const { prd, figma } = await getFiles(taskUUID)
    let asstPRDAnalyser, asstCSVGenerator
    let prdRes = " "
    let csvRes = " "
    let prdUploadId = " "
    let figmaUploadIds = [" ", " "]

    // TESTING ONLY
    await deleteFiles()

    // Get assistant
    asstPRDAnalyser = await getAssistant("prd_analyser")
    console.log(asstPRDAnalyser)
    asstCSVGenerator = await getAssistant("csv_generator")
    console.log(asstCSVGenerator)

    prdUploadId = (await uploadFiles([prd]))[0]
    figmaUploadIds = await uploadFiles(figma)

    let thread, message, run

    // Run prd_analyser
    thread = await openai.beta.threads.create();
    message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: "Analyse this file",
            attachments: [{ file_id: prdUploadId, tools: [{ type: "file_search" }] }]
        }
    );
    run = await openai.beta.threads.runs.createAndPoll(
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

    // Run csv_generator
    thread = await openai.beta.threads.create();
    message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: [{
                "type": "text",
                "text": `The important features as per the PRD are: ${prdRes}. Analyse with these UI files.`
            },
            ...figmaUploadIds.map(v => {
                return {
                    "type": "image_file",
                    "image_file": { "file_id": v }
                }
            })]
        }
    );
    run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        { assistant_id: asstCSVGenerator.id }
    );
    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        csvRes = messages.data[0].content[0].text.value
        for (const message of messages.data.reverse()) {
            console.log(`${message.role} > ${message.content[0].text.value}`);
        }
        console.log({ csvUsage: run.usage })
    } else {
        console.log(run.status);
    }

    return (
        <pre className="p-6 whitespace-pre-wrap">
            <p><strong>Task UUID:</strong> {taskUUID}</p>
            <p><strong>PRD File:</strong> {prd}</p>
            <p><strong>Figma Files:</strong> {figma.join(", ")}</p>
            <br />
            <p><strong>OpenAI Assistant (prd_analyser: {asstPRDAnalyser.id}):</strong> {assistantPrompts.prd_analyser}</p>
            <p><strong>PRD Upload ID:</strong> {prdUploadId}</p>
            <p><strong>prd_analyser Prompt:</strong> Analyse this file</p>
            <p><strong>prd_analyser Response:</strong></p>
            <p>{prdRes}</p>
            <br />
            <p><strong>OpenAI Assistant (csv_generator: {asstCSVGenerator.id}):</strong> {assistantPrompts.csv_generator}</p>
            <p><strong>Figma Upload IDs:</strong> {figmaUploadIds.join(", ")}</p>
            <p><strong>csv_generator Prompt:</strong> The important features as per the PRD are: {prdRes}. Analyse with these UI files.</p>
            <p><strong>csv_generator Response:</strong></p>
            <CSVTable csvRes={csvRes.substring(8, csvRes.length-5)} />
            <p>{csvRes}</p>
        </pre>
    )
}