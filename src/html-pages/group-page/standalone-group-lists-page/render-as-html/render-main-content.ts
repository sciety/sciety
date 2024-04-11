import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';

const renderListCount = () => '<p>This group has 1 list.</p>';

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderListCount()}
  ${renderListOfListCardsWithFallback(viewmodel.listCards)}
`);
