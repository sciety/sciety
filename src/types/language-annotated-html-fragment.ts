import * as O from 'fp-ts/Option';
import { LanguageCode } from '../shared-components/lang-attribute';
import { HtmlFragment } from './html-fragment';

export type LanguageAnnotatedHtmlFragment = {
  content: HtmlFragment,
  languageCode: O.Option<LanguageCode>,
};
