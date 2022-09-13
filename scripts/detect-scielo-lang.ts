import { detect } from 'tinyld';

const text = 'Evolución de casos confirmados de COVID-19 en cinco países con transmisión comunitaria de la enfermedad';

const detectLanguage = (t: string): string => detect(t, { only: ['en', 'es', 'pt'] });

console.log(detectLanguage(text));
