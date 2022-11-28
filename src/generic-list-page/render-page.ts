import { pipe } from 'fp-ts/function';
import { ArticleCardViewModel, renderContentWithPagination } from './articles-list/render-content-with-pagination';
import { noArticlesCanBeFetchedMessage, noArticlesMessage } from './articles-list/static-messages';
import { PageOfItems } from '../shared-components/paginate';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export type ContentViewModel = PageOfItems<ArticleCardViewModel> | 'no-articles' | 'no-articles-can-be-fetched';

type ViewModel = {
  title: string,
  header: HtmlFragment,
  basePath: string,
  contentViewModel: ContentViewModel,
  supplementary?: HtmlFragment,
};

type Render = (viewModel: ViewModel) => HtmlFragment;

const renderListOrMessage = (contentViewModel: ContentViewModel, basePath: string) => {
  if (contentViewModel === 'no-articles') {
    return noArticlesMessage;
  } if (contentViewModel === 'no-articles-can-be-fetched') {
    return noArticlesCanBeFetchedMessage;
  }
  return renderContentWithPagination(basePath)(contentViewModel);
};

const render: Render = ({
  header, contentViewModel, basePath, supplementary = toHtmlFragment(''),
}) => toHtmlFragment(`
  ${header}
  <section>
    ${renderListOrMessage(contentViewModel, basePath)}
  </section>
  ${supplementary}
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
