import { toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderPage = (viewmodel: ViewModel) => toHtmlFragment(`
  ${viewmodel.header}
  <div class="group-page-follow-toggle">
    ${viewmodel.followButton}
  </div>
  ${viewmodel.content}
`);
