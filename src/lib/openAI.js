"use server"
import OpenAI from "openai"
import ASSISTANTS from "./ASSISTANTS"
import { createReadStream, readdir, stat, unlink } from "fs"
import path from "path"

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
    const res = {local: [], openai: []}
    const localDir = path.resolve(process.cwd(), 'uploads')
    console.log({localDir})

    readdir(localDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(localDir, file);

            stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error stating file:', err);
                    return;
                }

                if (stats.isFile()) {
                    unlink(filePath, err => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            res.local.push(file)
                        }
                    });
                }
            });
        });
    });

    const list = await openai.files.list();

    for await (const f of list) {
        const file = await openai.files.del(f.id);
        res.openai.push(file)
    }

    return res
}