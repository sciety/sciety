import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment.js';
import { ViewModel } from '../view-model.js';
import { renderMainContent } from './render-main-content.js';
import { renderAsHtml as renderUserPageHeader } from '../../user-page-header/render-as-html.js';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderUserPageHeader(viewmodel.userDetails)}
  <div class="main-content main-content--user">
    ${renderMainContent(viewmodel)}
  </div>
`);
