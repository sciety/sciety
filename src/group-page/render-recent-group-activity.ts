import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
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

const renderAuthors = flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (authors) => `
      <div class="group-activity-list__card_authors">
        ${authors.join(', ')}.
      </div>
    `,
  ),
);

const renderActivity = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <article class="group-activity-list__card">
    <a class="group-activity-list__card_link" href="/articles/activity/${model.doi.value}">${model.title}</a>
    ${renderAuthors(model.authors)}
    <span class="group-activity-list__card_meta">
      ${renderEvaluationCount(model.evaluationCount)}<span>Latest version ${templateDate(model.latestVersionDate)}</span><span>Latest activity ${templateDate(model.latestActivityDate)}</span>
    </span>
  </article>
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
  RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
  (renderedActivities) => (
    `<ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>`
  ),
  toHtmlFragment,
);
