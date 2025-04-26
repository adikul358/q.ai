"use server"

import { Pool } from 'pg'
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
})

export async function addUser(user) {
    console.log("Connecting to DB...")
    const client = await pool.connect()
    console.log("Connected to DB")
    try {
        await client.query('BEGIN')

        const checkQuery = 'SELECT 1 FROM users WHERE email = $1'
        const checkResult = await client.query(checkQuery, [user.email])
        if (checkResult.rowCount === 0) {
            const insertQuery = `INSERT INTO users (name, email, image_url) VALUES ($1, $2, $3)`
            await client.query(insertQuery, [user.name, user.email, user.image])
        }
        await client.query('COMMIT')
        console.log('User checked/added successfully.')
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Error in addUserIfNotExists:', error)
    } finally {
        client.release()
    }
}

export default async function test() {
    try {
        const client = await pool.connect()
        console.log(await client.query('SELECT NOW() as now'))
    } catch (e) {
        console.log({ e })
    }
}