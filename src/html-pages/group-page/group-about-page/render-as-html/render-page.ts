import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderMainContent } from './render-main-content';
import { renderPageHeader } from './render-page-header';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderPageHeader(viewmodel)}
  ${renderMainContent(viewmodel)}
`);
