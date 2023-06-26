import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { LanguageAnnotatedHtmlFragment } from '../types/language-annotated-html-fragment';
import { renderLangAttribute } from './lang-attribute';

export const renderContentWithLanguageAsBlockElement = (
  languageAnnotatedHtmlFragment: LanguageAnnotatedHtmlFragment,
): HtmlFragment => toHtmlFragment(
  `<div${renderLangAttribute(languageAnnotatedHtmlFragment.languageCode)}>${languageAnnotatedHtmlFragment.content}</div>`,
);
