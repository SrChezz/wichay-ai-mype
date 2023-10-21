// Obtén una referencia a los elementos HTML que necesitas manipular
const preguntaNumero = document.querySelector('.golden-title');
const preguntaTexto = document.querySelector('.quiz-head h2');
const opciones = document.querySelectorAll('.quiz-option input[type="radio"]');
const opcionesText = document.querySelector('.quiz-option input[type="text"]');
const textos = document.querySelectorAll('.quiz-text input');
const botonSiguiente = document.querySelector('.button');
const progressVar = document.querySelector('.top-inner-container');

const preguntas = [
    {
        numero: 1,
        texto: "Información General",
        opciones: [
            "Nombre de la empresa:",
            "Industria:",
            "Tiempo en el mercado:",
            "Número de empleados:"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 2,
        texto: "¿Cuál es su principal fuente de ingresos?",
        opciones: [
            "Ventas de productos",
            "Ventas de servicios",
            "Ingresos por licencias o regalías",
            "Ingresos por publicidad",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 3,
        texto: "¿Cuál es su estrategia de precios actual?",
        opciones: [
            "Precios bajos para competir en el mercado",
            "Precios premium enfocados en la calidad",
            "Precios basados en la competencia",
            "Precios dinámicos según la demanda",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 4,
        texto: "¿Cuál es su principal canal de distribución?",
        opciones: [
            "Tiendas físicas",
            "Comercio electrónico (online)",
            "Mayoristas o distribuidores",
            "Ventas directas a través de equipos de ventas",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 5,
        texto: "¿Cuál es su principal desafío operativo actual?",
        opciones: [
            "Gestión de inventario",
            "Logística y transporte",
            "Calidad del producto / servicio",
            "Eficiencia en la producción",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 6,
        texto: "¿Qué estrategia utiliza para la adquisición de clientes?",
        opciones: [
            "Publicidad en línea (Google Ads, Facebook Ads)",
            "Marketing de contenidos y blogs",
            "Marketing por correo electrónico",
            "Redes sociales (Facebook, Instagram, LinkedIn)",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 7,
        texto: "¿Cómo mide el éxito de sus empleados?",
        opciones: [
            "Ventas o ingresos generados",
            "Cumplimiento de objetivos específicos",
            "Evaluaciones de desempeño",
            "Retroalimentación de los clientes",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        numero: 8,
        texto: "¿Cuál es su principal objetivo financiero a largo plazo?",
        opciones: [
            "Crecimiento sostenible",
            "Maximización de ganancias",
            "Diversificación de ingresos",
            "Reducción de deuda",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        texto: "¿Cuál es su enfoque principal en términos de innovación tecnológica?",
        opciones: [
            "Desarrollo de nuevos productos / servicios",
            "Mejora de la eficiencia operativa",
            "Experiencia del cliente digital",
            "Automatización de procesos",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    },
    {
        texto: "¿Cuáles son las principales iniciativas de responsabilidad social de su empresa?",
        opciones: [
            "Donaciones a organizaciones benéficas",
            "Reducción de la huella de carbono",
            "Programas de voluntariado para empleados",
            "Colaboraciones con comunidades locales",
            "Otro (especificar):"
        ],
        respuestaCorrecta: ""
    }
];

let respuestas = [];
let preguntaActualIndex = 0;

// Define una función para cambiar la pregunta y las opciones
function cambiarPregunta(pregunta) {
    progressVar.style.width = (preguntaActualIndex + 1) * (100 / 10) + "%";
    preguntaNumero.textContent = `Pregunta ${preguntaActualIndex + 1}/10`;
    preguntaTexto.textContent = pregunta.texto;

    opcionesText.style.display = "none";

    if (preguntaActualIndex == 0) {

        opciones.forEach((opcion, index) => {
            opcion.parentElement.style.display = "none";
        });

        textos.forEach((texto, index) => {
            texto.previousElementSibling.textContent = pregunta.opciones[index];
            //texto.value = pregunta.opciones[index];
        });

        console.log("mmm");


    } else {

        textos.forEach((opcion, index) => {
            opcion.parentElement.style.display = "none";
        });



        opciones.forEach((opcion, index) => {
            opcion.parentElement.style.display = "block";
            opcion.nextElementSibling.textContent = pregunta.opciones[index];
            opcion.value = pregunta.opciones[index];
        });
    }
}

// Llama a la función para mostrar la primera pregunta
cambiarPregunta(preguntas[preguntaActualIndex]);

// Agrega un controlador de eventos para el botón "Siguiente pregunta"


opciones[opciones.length - 1].addEventListener('change', function () {
    if (this.checked) {
        opcionesText.style.display = "block";

        opcionesText.addEventListener('change', () => {
            this.value = opcionesText.value;
        })

    } else {
        opcionesText.style.display = "none";
    }
});

botonSiguiente.addEventListener('click', () => {

    if (preguntaActualIndex == 0) {

        textos.forEach(res => {
            respuestas.push(res.value);
        });

        console.log(respuestas)
        preguntaActualIndex++;
        cambiarPregunta(preguntas[preguntaActualIndex]);
    } else {
        const respuestaSeleccionada = document.querySelector('.quiz-option input:checked');

        if (respuestaSeleccionada) {
            const respuesta = respuestaSeleccionada.value;

            respuestas.push(respuesta);

            // Avanzar a la siguiente pregunta si no hemos alcanzado el final
            if (preguntaActualIndex < preguntas.length - 1) {
                respuestaSeleccionada.checked = false;
                preguntaActualIndex++;
                cambiarPregunta(preguntas[preguntaActualIndex]);
            } else {
                // Final del cuestionario, construir la URL con las respuestas y redirigir
                const respuestasComoParametros = respuestas.map(r => `r=${encodeURIComponent(r)}`).join('&');
                const redirectURL = `/respuesta?${respuestasComoParametros}`;

                window.location.href = redirectURL;
            }
        }
    }
});