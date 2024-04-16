import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderPageHeader } from '../../common-components/render-page-header';
import { ViewModel } from '../view-model';
import { renderMainContent } from './render-main-content';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderPageHeader(viewmodel.header)}
  ${renderMainContent(viewmodel)}
`);
