import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderMainContent } from './render-main-content';
import { renderPageHeader } from '../../sub-page-header';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderPageHeader(viewmodel.header)}
  ${renderMainContent(viewmodel)}
`);
