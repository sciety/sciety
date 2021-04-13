import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { templateDate } from '../shared-components';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: number): HtmlFragment => pipe(
  evaluationCount === 1,
  (singular) => `${evaluationCount} ${singular ? 'evaluation' : 'evaluations'}`,
  wrapInSpan,
);

const renderActivity = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <div class="search-results-list__item_container">
    <a class="search-results-list__item__link" href="/articles/activity/${model.doi.value}">${model.title}</a>
    <div class="search-results-list__item__description">
      ${model.authors.join(', ')}.
    </div>
    <span class="search-results-list__item__meta">
      ${renderEvaluationCount(model.evaluationCount)}<span>Latest version ${templateDate(model.latestVersionDate)}</span><span>Latest activity ${templateDate(model.latestActivityDate)}</span>
    </span>
  </div>
`);

export type ArticleViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<SanitisedHtmlFragment>,
  latestVersionDate: Date,
  latestActivityDate: Date,
  evaluationCount: number,
};

export const renderRecentGroupActivity: (
  items: ReadonlyArray<ArticleViewModel>
) => HtmlFragment = flow(
  RA.map(renderActivity),
  RA.map((activity) => `<li class="search-results-list__item">${activity}</li>`),
  (renderedActivities) => (
    `<ul class="search-results-list" role="list">${renderedActivities.join('')}</ul>`
  ),
  toHtmlFragment,
);
