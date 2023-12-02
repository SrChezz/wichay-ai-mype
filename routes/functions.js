// router.mjs
import express from "express";
import openai from "../app.js"
import mysql from 'mysql2/promise';
import fs from 'fs';


const router = express.Router();

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


async function retornarDesarrolladorWeb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [rows] = await connection.query('SELECT * FROM freelancers WHERE Descripcion = "Desarrollador Web"');
        await connection.end();

        console.log(rows);

        const jsonData = JSON.stringify(rows);

        // console.log(jsonData);
        return jsonData;
    } catch (err) {
        throw new Error(`Error while getting data: ${err.message}`);
    }
}

async function retornarDisenadorGrafico() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        const [rows] = await connection.query('SELECT * FROM freelancers WHERE Descripcion = "Diseñador Grafico"');
        await connection.end();

        console.log(rows);

        const jsonData = JSON.stringify(rows);

        // console.log(jsonData);
        return jsonData;
    } catch (err) {
        throw new Error(`Error while getting data: ${err.message}`);
    }
}

async function getExperts() {
    // try {
    //     const connection = mysql.createConnection(process.env.DATABASE_URL)

    //     const [rows] = await connection.query('SELECT * FROM Experts');
    //     await connection.end();

    //     const jsonData = JSON.stringify(rows);

    //     // console.log(jsonData);
    //     return jsonData;
    // } catch (err) {
    //     throw new Error(`Error while getting data: ${err.message}`);
    // }
    let options = [
        {
            name: "Cesar Jose",
            lastName: "Vilchez Aguilar",
            price: "2",
            profession: "Diseñador Grafico",
            decripcion: "Soy diseñador",
            linktree: "https://linktr.ee/braxjewelers",
            picture: "./media/profile.png"
        },
        {
            name: "Jose Jose",
            lastName: "Atachao Aguilar",
            price: "3",
            profession: "Desarrollador web",
            decripcion: "Soy diseñador",
            linktree: "https://linktr.ee/startupsandiego",
            picture: "./media/profile.png"
        },
    ]
    const jsonData = JSON.stringify(options);
    return jsonData
}

async function recomendarExpertos(profesion) {
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL);

        //console.log(profesion);
        let SQL = `SELECT * FROM tbl_Expertos WHERE Profesion = "${profesion.d}"`
        console.log(SQL);
        const [rows] = await connection.execute(SQL);
        await connection.end();

        const jsonData = JSON.stringify(rows);

        //console.log(profesion);
        //console.log(jsonData);
        return jsonData;
    } catch (err) {
        throw new Error(`Error while getting data: ${err.message}`);
    }
}

router.post("/", async (req, res) => {
    //console.log(req.body);
    const { messages } = req.body;

    // const messages = [
    //     {
    //         role: 'user',
    //         content: 'Esto son los datos de mi empresa, dame un resumen de toda la informacion que te he brindado\n' +
    //             '        Nombre: Chezvil\n' +
    //             '        Industria:  Venta de Celulares\n' +
    //             '        Principal fuente de ingresos:  Ventas de productos\n' +
    //             '        Estrategia actual:  Precios basados en la competencia\n' +
    //             '        Principal canal de distribución:  Comercio electrónico (online)\n' +
    //             '        Desafío Operativo actual:  Logística y transporte\n' +
    //             '        Estrategia para clientes:  Marketing de contenidos y blogs\n' +
    //             '        Motivación de empleados:  Evaluaciones de desempeño\n' +
    //             '        Objetivo Financiero:  Crecimiento sostenible'
    //     },
    //     {
    //         role: 'assistant',
    //         content: 'En base a los datos que me has brindado, esta es la información recopilada de tu empresa:\n' +
    //             '\n' +
    //             'Nombre: Chezvil\n' +
    //             'Industria: Venta de Celulares\n' +
    //             'Principal fuente de ingresos: Ventas de productos\n' +
    //             'Estrategia actual: Precios basados en la competencia\n' +
    //             'Principal canal de distribución: Comercio electrónico (online)\n' +
    //             'Desafío Operativo actual: Logística y transporte\n' +
    //             'Estrategia para clientes: Marketing de contenidos y blogs\n' +
    //             'Motivación de empleados: Evaluaciones de desempeño\n' +
    //             'Objetivo Financiero: Crecimiento sostenible\n' +
    //             '\n' +
    //             'En resumen, Chezvil es una empresa dedicada a la venta de celulares que enfoca sus estrategias en ofrecer precios competitivos basados en la competencia. Su principal canal de distribución es a través del comercio electrónico, con un enfoque en el marketing de contenidos y blogs para atraer a los clientes. La empresa se enfrenta actualmente a desafíos en términos de logística y transporte. La motivación de los empleados se basa en las evaluaciones de desempeño y el objetivo financiero de la empresa es lograr un crecimiento sostenible.\n' +
    //             '\n' +
    //             '¿Te gustaría recibir recomendaciones para mejorar tu negocio?'
    //     },
    //     { role: 'user', content: 'Si, por favor, dame recomendaciones\n' },
    //     {
    //         role: 'assistant',
    //         content: 'Aquí te van algunas recomendaciones para mejorar tu negocio:\n' +
    //             '\n' +
    //             '- Optimiza tu proceso logístico y transporte para garantizar una entrega rápida y eficiente de los productos.\n' +
    //             '- Aprovecha las redes sociales y el marketing digital para expandir tu alcance y atraer a más clientes.\n' +
    //             '- Implementa programas de fidelización para mantener a tus clientes actuales y generar recomendaciones.\n' +
    //             '\n' +
    //             '¿Deseas que te recomiende a un profesional para que te ayude en tu negocio?'
    //     },
    //     { role: 'user', content: 'Si, recomiendame a expertos' }
    // ];

    //console.log(messages);

    try {
        let chat = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": `Eres WichayGPT, estas diseñado para dar consejos y tutorías sobre negocios y empresa. Brinda respuestas cortas siempre y cuando el usuario no especifique lo contrario` },
                ...messages
            ],
            functions: [
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
                    name: "describirEmpresa",
                    description: "Describe la empresa en base a los datos que te brinde el usuario. A continuacion pregunta si el usuario desea escuchar recomendaciones para su empresa",
                    parameters: {
                        type: "object",
                        properties: {
                            starting_sentence: {
                                type: "string",
                                description: "Oracion indicando que en base al cuestiornario respondido esta es la informacion que hemos recogido de tu empresa"
                            },
                            description: {
                                type: "string",
                                description: "Descripcion de la empresa con la informacion que consideres mas relevante"
                            },
                            closing_sentence: {
                                type: "string",
                                description: "Terminas de responder, preguntando si desea escuchar recomendaciones para mejorar su negocio"
                            },

                        },
                        required: ["starting_sentence", "description", "closing_sentence"],
                    }
                },
                {
                    name: "brindarRecomendaciones",
                    description: "El usuario acepta recbir consejos para mejorar su negocio. Brindale los 3 que consideres de mayor importancia de forma precisa y compacta",
                    parameters: {
                        type: "object",
                        properties: {
                            advices: {
                                type: "string",
                                description: "Consejos"
                            },
                            closing_sentence: {
                                type: "string",
                                description: "Pregunta si desea que le recomiendes a un profesional para que le ayude en su negocio"
                            },

                        },
                        required: ["advices", "closing_sentence"],
                    }
                },
                {
                    name: "recomendarExpertos",
                    description: "Le recomiendas al usuario 2 profesionales en base las dificultades de la empresa",
                    parameters: {
                        type: "object",
                        properties: {
                            profesion: {
                                type: "string",
                                description: "Profesion de un experto eg Diseñador Grafico",
                                "enum": [
                                    'Diseñador Gráfico',
                                    'Desarrollador Web',
                                    'Marketing Digital',
                                    'Contador',
                                    'Especialista en Redes Sociales',
                                    'Fotógrafo',
                                    'Consultor de Negocios',
                                    'Gestor de Proyectos',
                                    'Diseñador de Interiores',
                                    'Consultor Legal',
                                    'Consultor en Importaciones',
                                    'Especializada en logística y transporte'
                                ]
                            },
                        },
                        required: ["profesion"],
                    }
                },
                // {
                //     name: "retornarDesarrolladorWeb",
                //     description: "Imprime una descripcion que sea igual a Desarrollador Web",
                //     parameters: {
                //         type: "object",
                //         properties: {

                //         },
                //         require: ["retornarDesarrolladorWeb"],
                //     }
                // },
                // {
                //     name: "retornarDisenadorGrafico",
                //     description: "Imprime una descripcion que sea igual a Disenador Grafico",
                //     parameters: {
                //         type: "object",
                //         properties: {

                //         },
                //         require: ["retornarDisenadorGrafico"],
                //     }
                // }
            ],
            function_call: "auto",
        });

        const responseMessage = chat.choices[0].message;
        let content = "";

        if (responseMessage.function_call) {
            //console.log(responseMessage.function_call.name);

            switch (responseMessage.function_call.name) {
                case "retornarEmoji":
                    content = retornarEmoji();
                    break;
                case "recomendarExpertos":
                    let function_args = JSON.parse(responseMessage["function_call"]["arguments"]);

                    let profesion = function_args.profesion
                    //console.log("Asignar interior a profesion");
                    //console.log(profesion);

                    content = await recomendarExpertos({
                        d: profesion
                    });
                    break;

                // case "retornarDesarrolladorWeb":
                //     const dataWeb = await retornarDesarrolladorWeb();
                //     content = dataWeb;
                //     break;
                // case "retornarDisenadorGrafico":
                //     const dataGrafico = await retornarDisenadorGrafico();
                //     content = dataGrafico;
                //     break;
                default:
                    break;
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

        //console.log(step4response.choices[0].message.content)
        res.json({
            completion: step4response.choices[0].message
        });
    } catch (error) {
        console.error('Error en la ejecución:', error);
        res.status(500).send('Error interno del servidor');
    }
});


export default router;
