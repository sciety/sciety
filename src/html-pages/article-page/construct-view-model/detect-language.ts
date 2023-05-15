import { detect } from 'tinyld';

export const detectLanguage = (input: string) => detect(input, { only: ['en', 'es', 'pt'] });
