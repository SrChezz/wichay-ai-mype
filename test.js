import 'dotenv/config'

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.AI_KEY
});

const student1Description = "David Nguyen is a sophomore majoring in computer science at Stanford University. He is Asian American and has a 3.8 GPA. David is known for his programming skills and is an active member of the university's Robotics Club. He hopes to pursue a career in artificial intelligence after graduating.";

const student2Description = "Ravi Patel is a sophomore majoring in computer science at the University of Michigan. He is South Asian Indian American and has a 3.7 GPA. Ravi is an active member of the university's Chess Club and the South Asian Student Association. He hopes to pursue a career in software engineering after graduating.";

const studentCustomFunctions = [
    {
        name: 'extract_student_info',
        description: 'Get the student information from the body of the input text',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the person',
                },
                major: {
                    type: 'string',
                    description: 'Major subject.',
                },
                school: {
                    type: 'string',
                    description: 'The university name.',
                },
                grades: {
                    type: 'integer',
                    description: 'GPA of the student.',
                },
                club: {
                    type: 'string',
                    description: 'School club for extracurricular activities. ',
                },
            },
        },
    },
];

const studentDescription = [student1Description, student2Description, 'hola'];

studentDescription.forEach((sample) => {
    openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: sample }],
        functions: studentCustomFunctions,
        function_call: 'auto',
    }).then((response) => {
        const json_response = 0;
        if (response.choices[0].message.function_call.arguments) {
            json_response = response.choices[0].message.function_call.arguments;
        } else {
            json_response = response.choices[0].message;
        }

        console.log(JSON.parse(json_response));
    });
});
