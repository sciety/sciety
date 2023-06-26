import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { LanguageAnnotated } from '../types/language-annotated';
import { renderLangAttribute } from './lang-attribute';

export const renderContentWithLanguageAsBlockElement = (
  languageAnnotatedHtmlFragment: LanguageAnnotated<HtmlFragment>,
): HtmlFragment => toHtmlFragment(
  `<div${renderLangAttribute(languageAnnotatedHtmlFragment.languageCode)}>${languageAnnotatedHtmlFragment.content}</div>`,
);
