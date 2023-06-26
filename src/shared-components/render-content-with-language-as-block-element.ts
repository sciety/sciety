import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { LanguageAnnotated } from '../types/language-annotated';
import { renderLangAttribute } from './lang-attribute';

export const renderContentWithLanguageAsBlockElement = <C extends string>(
  languageAnnotatedHtmlFragment: LanguageAnnotated<C>,
): HtmlFragment => toHtmlFragment(
    `<div${renderLangAttribute(languageAnnotatedHtmlFragment.languageCode)}>${languageAnnotatedHtmlFragment.content}</div>`,
  );
