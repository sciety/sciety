import { renderHeader } from './render-header';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { noArticlesCanBeFetchedMessage, noArticlesMessageForOwner, noArticlesMessageForReader } from './static-messages';
import { ViewModel } from '../view-model';
import { renderContentWithPagination } from './render-content-with-pagination';

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

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  ${renderHeader(viewModel)}
  <section>
    ${renderListOrMessage(viewModel)}
  </section>
`);
