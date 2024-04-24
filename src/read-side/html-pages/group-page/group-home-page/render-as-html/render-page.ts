import { renderMainContent } from './render-main-content';
import { renderPageHeader } from './render-page-header';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderPageHeader(viewmodel.header)}
  ${renderMainContent(viewmodel)}
`);
