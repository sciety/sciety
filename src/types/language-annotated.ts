import * as O from 'fp-ts/Option';
import { LanguageCode, detectLanguage } from '../shared-components/lang-attribute';

export type LanguageAnnotated<C> = {
  content: C,
  languageCode: O.Option<LanguageCode>,
};

export const annotateWithLanguage = <C extends string>(content: C): LanguageAnnotated<C> => ({
  content,
  languageCode: detectLanguage(content),
});
