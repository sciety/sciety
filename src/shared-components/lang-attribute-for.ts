import { detect } from 'tinyld';

export const langAttributeFor = (text: string): string => {
  const code = detect(text, { only: ['en', 'es', 'pt'] });
  return code === '' ? '' : ` lang="${code}"`;
};
