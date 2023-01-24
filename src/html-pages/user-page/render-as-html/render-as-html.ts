import { toHtmlFragment } from '../../../types/html-fragment';
import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewmodel: ViewModel): Page => ({
  title: viewmodel.userDisplayName,
  openGraph: {
    title: viewmodel.userDisplayName,
    description: viewmodel.description,
  },
  content: toHtmlFragment(`
    ${viewmodel.header}
    <div class="main-content main-content--user">
      ${viewmodel.mainContent}
    </div>
  `),
});
