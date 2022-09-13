import { detect } from 'tinyld';

const titleEn = 'Overview of confirmed cases of COVID-19 in five countries facing community transmission';
const titleEs = 'Evolución de casos confirmados de COVID-19 en cinco países con transmisión comunitaria de la enfermedad';
const titlePt = 'Evolução de casos confirmados de COVID-19 em cinco países com transmissão comunitária da doença';

const detectLanguage = (t: string): string => detect(t, { only: ['en', 'es', 'pt'] });

console.log('English text:', titleEn);
console.log('detected:', detectLanguage(titleEn));
console.log('Spanish text:', titleEs);
console.log('detected:', detectLanguage(titleEs));
console.log('Portuguese text:', titlePt);
console.log('detected:', detectLanguage(titlePt));
