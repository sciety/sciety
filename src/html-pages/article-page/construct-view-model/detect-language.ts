import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { detect } from 'tinyld';

export const detectLanguage = (input: string) => pipe(
  detect(input, { only: ['en', 'es', 'pt'] }),
  O.fromPredicate((languageCode) => languageCode !== ''),
);
