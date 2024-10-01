import { htmlEscape } from 'escape-goat';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { renderCategoryContent } from './render-category-content';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { renderPaginationControls } from '../../shared-components/pagination';
import { PaginatedCards, ViewModel } from '../view-model';

const renderInformationalMessage = (message: string) => toHtmlFragment(`<p>${message}</p>`);

const renderPaginatedCards = (paginatedCards: PaginatedCards) => `
      ${renderCategoryContent(paginatedCards.categoryContent)}
      ${process.env.EXPERIMENT_ENABLED === 'true' ? renderPaginationControls(paginatedCards.paginationControls) : ''}
      `;

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(
    `
    <header class="page-header">
      <h1>${htmlEscape(viewModel.pageHeading)}</h1>
    </header>
    <section>
      ${pipe(
    viewModel.content,
    E.match(
      renderInformationalMessage,
      renderPaginatedCards,
    ),
  )}
    </section>
  `,
  ),
});
