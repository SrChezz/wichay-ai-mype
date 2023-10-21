import 'dotenv/config'

import mysql from 'mysql2/promise';

// Modify the connection details to match the details specified while
// deploying the SingleStore workspace:
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

async function readN({ connection }) {
    const [rows] = await connection.execute(
        'SELECT * FROM freelancers'
    );
    return rows;
}

// main is run at the end
async function main() {
    let singleStoreConnection;
    let messages;
    try {
        singleStoreConnection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        messages = await readN({ connection: singleStoreConnection });
        console.log('Read rows:');
        if (messages.length === 0) {
            console.log('No messages found.');
        } else {
            for (const message of messages) {
                //console.log(message);
            }
        }

        console.log('You have successfully connected to SingleStore.');
    } catch (err) {
        console.error('ERROR', err);
        process.exit(1);
    } finally {
        if (singleStoreConnection) {

            await singleStoreConnection.end();
            return messages;
        }
    }
}

export default main

