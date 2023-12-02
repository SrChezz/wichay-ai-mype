import 'dotenv/config'
import mysql from 'mysql2/promise';

// Modify the connection details to match the details specified while
// deploying the SingleStore workspace:
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

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

async function readN({ connection }) {
    const [rows] = await connection.execute(
        'SELECT * FROM freelancers'
    );
    console.log(rows);
    return rows;
}



//export default main

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.AI_KEY
});

function helloWorld(appendString) {
    let hello = "Hello World! " + appendString;
    //return hello;
    return JSON.stringify(hello);
}

function retornarEmoji() {
    let emoji = "😊";
    return emoji;
}

async function buscarProfesionales(descripcion) {

}

// Get the current time of day
function getTimeOfDay() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let timeOfDay = "AM";
    if (hours > 12) {
        hours = hours - 12;
        timeOfDay = "PM";
    }
    return hours + ":" + minutes + ":" + seconds + " " + timeOfDay;
    return JSON.stringify(hours + ":" + minutes + ":" + seconds + " " + timeOfDay);
}

// Define your ChatGPT Function
async function runConversation() {
    let messages = [{
        role: "system",
        content: "Perform function requests for the user",
    }, {
        role: "user",
        content: "Give an emoji",
    }];
    // Step 1: Call ChatGPT with the function name
    let chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        functions: [{
            name: "helloWorld",
            description: "Prints hello world with the string passed to it",
            parameters: {
                type: "object",
                properties: {
                    appendString: {
                        type: "string",
                        description: "The string to append to the hello world message",
                    },
                },
                require: ["appendString"],
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
        },
        {
            name: "getTimeOfDay",
            description: "Get the time of day.",
            parameters: {
                type: "object",
                properties: {
                },
                require: [],
            }
        },
        {
            name: "getTimeOfDay",
            description: "Get the time of day.",
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
    // Step 2: Check if ChatGPT wants to use a function
    if (responseMessage.function_call) {
        // Step 3: Use ChatGPT arguments to call your function
        console.log(responseMessage.function_call.name);
        if (responseMessage.function_call.name == "helloWorld") {
            let argumentObj = JSON.parse(chat.choices[0].message.function_call.arguments);
            content = helloWorld(argumentObj.appendString);
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "helloWorld",
                content,
            });
        }
        if (responseMessage.function_call.name == "getTimeOfDay") {
            content = getTimeOfDay();
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "getTimeOfDay",
                content,
            });
        }

        if (responseMessage.function_call.name == "retornarEmoji") {
            content = retornarEmoji();
            messages.push(chat.choices[0].message);
            messages.push({
                role: "function",
                name: "darNoches",
                content,
            });
        }
    }

    // Step 4: Call ChatGPT again with the function response
    let step4response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
    });
    console.log(step4response.choices[0].message);
}

//runConversation();
