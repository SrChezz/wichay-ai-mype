import 'dotenv/config'

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.AI_KEY
});

function helloWorld(appendString) {
    let hello = "Hello World! " + appendString;
    //return hello;
    return JSON.stringify(hello);
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
        content: "Hello, I am a user, add hello world to this sentence 'loving people'",
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
    }

    // Step 4: Call ChatGPT again with the function response
    let step4response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
    });
    console.log(step4response.choices[0].message);
}

runConversation();
