import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderCategoryContent } from './render-category-content';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { renderPaginationControls } from '../../shared-components/pagination';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(
    `
    <header class="page-header">
      <h1>${htmlEscape(viewModel.pageHeading)}</h1>
    </header>
    <section>
      ${renderCategoryContent(viewModel.categoryContent)}
      ${process.env.EXPERIMENT_ENABLED === 'true' ? pipe(viewModel.paginationControls, O.match(() => '', renderPaginationControls)) : ''}
    </section>
  `,
  ),
});
