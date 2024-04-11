import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';

const renderListCount = () => `<p>This group has ${renderCountWithDescriptor(1, 'list', 'lists')}.</p>`;

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderListCount()}
  ${renderListOfListCardsWithFallback(viewmodel.listCards)}
`);
