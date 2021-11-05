import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ArticleErrorCardViewModel = {
  evaluationCount: number,
  href: string,
  latestActivityDate: O.Option<Date>,
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

export const renderArticleErrorCard = (viewModel: ArticleErrorCardViewModel): HtmlFragment => (
  toHtmlFragment(`
    <article class="article-card">
      <a class="article-card__link" href="${viewModel.href}">
        <p class="article-card__error_message">
          Can't currently display this article.
        </p>
        <footer class="article-card__footer">
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span>${renderEvaluationCount(viewModel.evaluationCount)}${renderArticleLatestActivityDate(viewModel.latestActivityDate)}
          </div>
        </footer>
      </a>
    </article>
  `)
);
