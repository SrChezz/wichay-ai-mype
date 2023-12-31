import 'dotenv/config'

// app.mjs
import OpenAI from 'openai';
import cors from "cors";
import express from "express";
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
// Importa bodyParser

import homeRouter from "./routes/home.js"; // Importa homeRouter desde el archivo adecuado
import functionRouter from "./routes/functions.js"; // Importa homeRouter desde el archivo adecuado

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
    apiKey: process.env.AI_KEY
});

const app = express();

//Con otro servidor local
// const corsOptions = {
//     origin: "http://127.0.0.1:5500",
//     optionsSuccessStatus: 200 // For legacy browser support
// };

// app.use(cors(corsOptions)); // Utiliza app.use para 

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// app.set('layout', 'layouts/layout');
// app.use(expressLayouts);

app.use("/", homeRouter);
app.use("/functions", functionRouter);

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});


export default openai; // Exporta la instancia de express 'app', no 'openai'
