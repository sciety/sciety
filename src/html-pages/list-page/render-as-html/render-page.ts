import { renderHeader } from './render-header';
import { toHtmlFragment } from '../../../types/html-fragment';
import { renderContentWithPagination } from '../articles-list/render-content-with-pagination';
import { noArticlesCanBeFetchedMessage, noArticlesMessageForOwner, noArticlesMessageForReader } from '../articles-list/static-messages';
import { ViewModel } from '../view-model';

const renderListOrMessage = (viewModel: ViewModel) => {
  switch (viewModel.contentViewModel) {
    case 'no-articles':
      return viewModel.editCapability ? noArticlesMessageForOwner : noArticlesMessageForReader;
    case 'no-articles-can-be-fetched':
      return noArticlesCanBeFetchedMessage;
    default:
      return renderContentWithPagination(viewModel.basePath, viewModel.contentViewModel, viewModel.listId);
  }
};

export const renderPage = (viewModel: ViewModel) => toHtmlFragment(`
  ${renderHeader(viewModel)}
  <section>
    ${renderListOrMessage(viewModel)}
  </section>
`);
