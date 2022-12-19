import { pipe } from 'fp-ts/function';
import { ViewModel as HeaderViewModel, renderHeader } from './render-header';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { Page } from '../../../types/page';
import { RenderPageError } from '../../../types/render-page-error';
import { ContentWithPaginationViewModel, renderContentWithPagination } from '../articles-list/render-content-with-pagination';
import { noArticlesCanBeFetchedMessage, noArticlesMessage } from '../articles-list/static-messages';

type Message = 'no-articles' | 'no-articles-can-be-fetched';

export type ContentViewModel = Message | ContentWithPaginationViewModel;

type ViewModel = {
  title: string,
  basePath: string,
  contentViewModel: ContentViewModel,
} & HeaderViewModel;

const renderListOrMessage = (contentViewModel: ContentViewModel, basePath: string, listId: ListId) => {
  if (contentViewModel === 'no-articles') {
    return noArticlesMessage;
  } if (contentViewModel === 'no-articles-can-be-fetched') {
    return noArticlesCanBeFetchedMessage;
  }
  return renderContentWithPagination(basePath)(contentViewModel, listId);
};

const render = (viewModel: ViewModel) => toHtmlFragment(`
  ${renderHeader(viewModel)}
  <section>
    ${renderListOrMessage(viewModel.contentViewModel, viewModel.basePath, viewModel.listId)}
  </section>
`);

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  DE.fold({
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
  content: pipe(viewModel, render, toHtmlFragment),
});
