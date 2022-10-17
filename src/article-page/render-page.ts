import { ViewModel } from './view-model';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${viewmodel.header}
  ${viewmodel.articleActions}
  ${viewmodel.articleAbstract}
  <div class="main-content">
    ${viewmodel.mainContent}
  </div>
`);
