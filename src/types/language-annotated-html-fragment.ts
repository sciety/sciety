import * as O from 'fp-ts/Option';
import { LanguageCode, detectLanguage } from '../shared-components/lang-attribute';
import { HtmlFragment } from './html-fragment';

export type LanguageAnnotatedHtmlFragment = {
  content: HtmlFragment,
  languageCode: O.Option<LanguageCode>,
};

export const annotateWithLanguage = (content: HtmlFragment): LanguageAnnotatedHtmlFragment => ({
  content,
  languageCode: detectLanguage(content),
});
