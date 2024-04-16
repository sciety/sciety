import { renderMainContent } from './render-main-content';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderAsHtml as renderUserPageHeader } from '../../user-page-header/render-as-html';
import { ViewModel } from '../view-model';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderUserPageHeader(viewmodel.userDetails)}
  <div class="main-content main-content--user">
    ${renderMainContent(viewmodel)}
  </div>
`);
