import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { renderCountWithDescriptor } from '../../../../../shared-components/render-count-with-descriptor';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../view-model';

const renderListCount = (listCount: ViewModel['listCount']) => `<p>This group has ${renderCountWithDescriptor(listCount, 'list', 'lists')}.</p>`;

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderListCount(viewmodel.listCount)}
  ${renderListOfListCardsWithFallback(viewmodel.listCards)}
`);
