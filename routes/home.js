// router.mjs
import express from "express";
import openai from "../app.js"

const router = express.Router();

router.get("/", async (req, res) => {
    console.log("This is the main page");
    res.render("index");
});

router.get("/quiz", async (req, res) => {
    // console.log("This is another test");
    res.render("quiz");
});

router.get('/respuesta', (req, res) => {
    // Recupera las respuestas de la URL
    const respuestas = req.query.r || [];

    if (respuestas.length == 0) {
        console.log("no formatting")
        res.render("respuesta", { diagnostico: "" })
    } else {
        let diagnostico = `Esto son los datos de mi empresa, dame un resumen de toda la informacion que te he brindado
        Nombre: ${respuestas[0]}
        Industria:  ${respuestas[1]}
        Principal fuente de ingresos:  ${respuestas[2]}
        Estrategia actual:  ${respuestas[3]}
        Principal canal de distribución:  ${respuestas[4]}
        Desafío Operativo actual:  ${respuestas[5]}
        Estrategia para clientes:  ${respuestas[6]}
        Motivación de empleados:  ${respuestas[7]}
        Objetivo Financiero:  ${respuestas[8]}`

        res.render("respuesta", { diagnostico: diagnostico })
    }

    console.log(respuestas)
});

router.post('/redirect', (req, res) => {
    // Recupera las respuestas de la URL
    const respuestas = req.body || [];

    // Procesa y muestra las respuestas
    // res.send(`Tus respuestas son: ${respuestas.join(', ')}`);
    console.log(req.body)

    res.json(req.body);
});

router.get('/respuesta2', (req, res) => {
    res.render("respuesta2")
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const { messages } = req.body;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": `Eres WichayGPT, estas diseñado para dar consejos y tutorías sobre negocios y empresa. Brinda respuestas cortas siempre y cuando el usuario no especifique lo contrario` },
            ...messages
        ]
    });

    res.json({
        completion: chatCompletion.choices[0].message
    });
});

let custom_functions = [
    {
        'name': 'extract_student_info',
        'description': 'Get the student information from the body of the input text in JSON',
        'parameters': {
            'type': 'object',
            'properties': {
                'name': {
                    'type': 'string',
                    'description': 'Name of the person'
                },
                'major': {
                    'type': 'string',
                    'description': 'Major subject.'
                },
                'school': {
                    'type': 'string',
                    'description': 'The university name.'
                },
                'grades': {
                    'type': 'integer',
                    'description': 'GPA of the student.'
                },
                'club': {
                    'type': 'string',
                    'description': 'School club for extracurricular activities. '
                }

            }
        }
    }
]

router.post("/function", async (req, res) => {
    console.log(req.body);
    const { messages } = req.body;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": `Eres WichayGPT, estas diseñado para dar consejos y tutorías sobre negocios y empresa. Brinda respuestas cortas siempre y cuando el usuario no especifique lo contrario` },
            ...messages
        ],
        functions: custom_functions,
        function_call: 'auto'
    });

    res.json({
        completion: chatCompletion.choices['choices'][0]['message']['function_call']['arguments'].message


    });
});


router.post("/first", async (req, res) => {
    console.log(req.body);
    const { messages } = req.body;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "system", "content": `Eres WichayGPT, estas diseñado para dar consejos y tutorías sobre negocios y empresa. Brinda respuestas cortas siempre y cuando el usuario no especifique lo contrario` },
            ...messages
        ]
    });

    res.json({
        completion: chatCompletion.choices[0].message
    });
});



export default router;
