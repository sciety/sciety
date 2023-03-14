import { pipe } from 'fp-ts/function';
import { renderHeader } from './render-header';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Page } from '../../../types/page';
import { RenderPageError } from '../../../types/render-page-error';
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

const render = (viewModel: ViewModel) => toHtmlFragment(`
  ${renderHeader(viewModel)}
  <section>
    ${renderListOrMessage(viewModel)}
  </section>
`);

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  DE.match({
    notFound: () => 'We couldn\'t find this information.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);

export const renderPage = (viewModel: ViewModel): Page => ({
  title: viewModel.title,
  openGraph: {
    title: viewModel.title,
    description: viewModel.description,
  },
  description: viewModel.description,
  content: pipe(viewModel, render, toHtmlFragment),
});
