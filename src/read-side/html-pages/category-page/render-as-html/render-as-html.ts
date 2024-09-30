import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { renderCategoryContent } from './render-category-content';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { renderPaginationControls } from '../../shared-components/pagination';
import { ViewModel } from '../view-model';

const paginationControlsViewModel = {
  backwardPageHref: O.some('/backward-page-href'),
  forwardPageHref: O.some('/forward-page-href'),
  page: 1,
  pageCount: 100,
};

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(
    `
    <header class="page-header">
      <h1>${htmlEscape(viewModel.pageHeading)}</h1>
    </header>
    <section>
      ${renderCategoryContent(viewModel.categoryContent)}
      ${process.env.EXPERIMENT_ENABLED === 'true' ? renderPaginationControls(paginationControlsViewModel) : ''}
    </section>
  `,
  ),
});
