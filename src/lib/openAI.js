import OpenAI from "openai"
import ASSISTANTS from "./ASSISTANTS"
import { createReadStream } from "fs"

const openai = new OpenAI()

export const getAssistant = async (name) => {
    const myAssistants = await openai.beta.assistants.list();

    let asst = myAssistants.data.find(v => v.name == name)

    // TODO: ADD CHECK FOR ASSISTANT PROMPT AND UPDATE
    if (!asst) {
        if (ASSISTANTS[name]) {
            asst = await openai.beta.assistants.create(ASSISTANTS[name])
            console.log(`Created Assistant ${asst.id} (${name})`)
        } else {
            throw new Error("Assistant not found in src/lib/ASSISTANTS.js")
        }
    }

    return asst
}

export const uploadFiles = async (files) => {
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

export const deleteFiles = async () => {
    const list = await openai.files.list();
    const res = []

    for await (const f of list) {
        const file = await openai.files.del(f.id);
        res.push(file)
    }

    return res
}