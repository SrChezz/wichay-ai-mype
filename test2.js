import 'dotenv/config';
import mysql from 'mysql2/promise';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.AI_KEY
});

async function getData() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [rows] = await connection.query('SELECT * FROM freelancers');
        await connection.end();

        const jsonData = JSON.stringify(rows);

        // console.log(jsonData);
        return jsonData;
    } catch (err) {
        throw new Error(`Error while getting data: ${err.message}`);
    }
}

function retornarEmoji() {
    return "😊";
}

async function runConversation() {
    let messages = [
        {
            role: "system",
            content: "Eres Wichay GPT, realiza las funciones que el usuario te pida",
        },
        {
            role: "user",
            content: "Dame todos los datos qua has encontrado.",
        }
    ];

    let chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        functions: [{
            name: "devolverDatos",
            description: "Devolvemos todos los datos que econtramos en nuestra base de datos",
            parameters: {
                type: "object",
                properties: {
                },
                require: ["getData"],
            }
        },
        {
            name: "retornarEmoji",
            description: "Imprime un emoji de vuelta",
            parameters: {
                type: "object",
                properties: {

                },
                require: [],
            }
        }],
        function_call: "auto",
    });

    const responseMessage = chat.choices[0].message;
    let content = "";



    if (responseMessage.function_call) {

        console.log(responseMessage.function_call.name);

        if (responseMessage.function_call.name === "retornarEmoji") {
            content = retornarEmoji();
        }

        if (responseMessage.function_call.name === "devolverDatos") {
            const data = await getData();
            content = data;
        }

        messages.push(chat.choices[0].message);
        messages.push({
            role: "function",
            name: responseMessage.function_call.name,
            content,
        });
    }



    let step4response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
    });

    console.log(step4response.choices[0].message.content);
}

runConversation();