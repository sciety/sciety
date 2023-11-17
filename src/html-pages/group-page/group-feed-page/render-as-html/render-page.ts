import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';
import { renderPageHeader } from '../../common-components/page-header.js';
import { ViewModel } from '../view-model.js';
import { renderMainContent } from './render-main-content.js';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderPageHeader(viewmodel)}
  ${renderMainContent(viewmodel)}
`);
