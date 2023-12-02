import 'dotenv/config';
import mysql from 'mysql2/promise';

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

async function readData({ connection }) {
    try {
        const [rows] = await connection.execute('SELECT * FROM freelancers');
        return rows;
    } catch (err) {
        throw new Error(`Error while reading data: ${err.message}`);
    }
}

async function main() {
    let singleStoreConnection;
    let messages;

    try {
        // Verificar que todas las variables 

        singleStoreConnection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        messages = await readData({ connection: singleStoreConnection });

        console.log('Read rows:');
        if (messages.length === 0) {
            console.log('No messages found.');
        } else {
            for (const message of messages) {
                console.log(message);
            }
        }

        console.log('Conexión exitosa a SingleStore.');
    } catch (err) {
        console.error('ERROR', err);
        process.exit(1);
    } finally {
        if (singleStoreConnection) {
            await singleStoreConnection.end();
        }
    }
}

main();
