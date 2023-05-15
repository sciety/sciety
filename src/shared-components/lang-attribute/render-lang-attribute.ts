import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LanguageCode } from './detect-language';

export const renderLangAttribute = (code: O.Option<LanguageCode>): string => pipe(
  code,
  O.match(
    () => '',
    (lc) => ` lang="${lc}"`,
  ),
);
