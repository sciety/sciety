import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderPage = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${viewmodel.header}
  <div class="main-content main-content--user">
    ${viewmodel.mainContent}
  </div>
`);
