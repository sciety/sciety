import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { detect } from 'tinyld';

const supportedLanguages = [
  'en' as const,
  'es' as const,
  'pt' as const,
];

export type LanguageCode = (typeof supportedLanguages)[number];

export const detectLanguage = (input: string): O.Option<LanguageCode> => pipe(
  detect(input, { only: supportedLanguages }),
  O.fromPredicate((languageCode): languageCode is LanguageCode => languageCode !== ''),
);
