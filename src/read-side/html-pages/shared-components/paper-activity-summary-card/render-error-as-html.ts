import * as DE from '../../../../types/data-error';
import { ExpressionDoi } from '../../../../types/expression-doi';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export type ErrorViewModel = {
  href: string,
  error: DE.DataError,
  inputExpressionDoi: ExpressionDoi,
};

const renderErrorMessage = DE.match({
  notFound: () => 'The title and authors for this article are not available from our external data provider yet:',
  unavailable: () => 'We couldn\'t get details of this article at this time:',
  notAuthorised: () => 'You aren\'t permitted to do that.',
});

export const renderErrorAsHtml = (viewModel: ErrorViewModel): HtmlFragment => (
  toHtmlFragment(`
    <article class="article-card">
      <a href="${viewModel.href}">
        <p class="article-card__error_message">
          ${renderErrorMessage(viewModel.error)}<br>
          ${viewModel.inputExpressionDoi}
        </p>
      </a>
    </article>
  `)
);
