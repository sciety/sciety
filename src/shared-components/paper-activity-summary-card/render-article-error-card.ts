import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { templateDate } from '../date';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ExpressionDoi } from '../../types/expression-doi';

export type ArticleErrorCardViewModel = {
  evaluationCount: number,
  href: string,
  latestActivityAt: O.Option<Date>,
  error: DE.DataError,
  inputExpressionDoi: ExpressionDoi,
};

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: number): HtmlFragment => pipe(
  evaluationCount === 1,
  (singular) => `${evaluationCount} ${singular ? 'evaluation' : 'evaluations'}`,
  wrapInSpan,
);

const renderArticleLatestActivityDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest activity ${date}`,
    wrapInSpan,
  ),
);

const renderErrorMessage = DE.match({
  notFound: () => 'The title and authors for this article are not available from our external data provider yet:',
  unavailable: () => 'We couldn\'t get details of this article at this time:',
});

export const renderArticleErrorCard = (viewModel: ArticleErrorCardViewModel): HtmlFragment => (
  toHtmlFragment(`
    <article class="article-card">
      <a href="${viewModel.href}">
        <p class="article-card__error_message">
          ${renderErrorMessage(viewModel.error)}<br>
          ${viewModel.inputExpressionDoi}
        </p>
        <footer class="article-card__footer">
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span>${renderEvaluationCount(viewModel.evaluationCount)}${renderArticleLatestActivityDate(viewModel.latestActivityAt)}
          </div>
        </footer>
      </a>
    </article>
  `)
);
