import { htmlEscape } from 'escape-goat';
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
type RenderAuthors = (authors: ReadonlyArray<string>) => HtmlFragment;
const renderAuthors: RenderAuthors = flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    flow(
      RNEA.map((author) => `<li class="group-activity-list__card_author">${htmlEscape(author)}</li>`),
      (authors) => `
      <ol class="group-activity-list__card_authors" role="list">
        ${authors.join('\n')}
      </ol>
    `,
    ),
  ),
  toHtmlFragment,
);

const renderActivity = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <article class="group-activity-list__card">
    <h3 class="group-activity-list__card_title">
      <a class="group-activity-list__card_link" href="/articles/activity/${model.doi.value}">${model.title}</a>
    </h3>
    ${renderAuthors(model.authors)}
    <span class="group-activity-list__card_meta">
      ${renderEvaluationCount(model.evaluationCount)}<span>Latest version ${templateDate(model.latestVersionDate)}</span><span>Latest activity ${templateDate(model.latestActivityDate)}</span>
    </span>
  </article>
`);

type ArticleViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: Date,
  latestActivityDate: Date,
  evaluationCount: number,
};

const noActivity = `
  <p>
    It looks like this group hasn’t evaluated any articles yet. Try coming back later!
  </p>
`;

export const renderRecentGroupActivity: (
  items: ReadonlyArray<ArticleViewModel>
) => HtmlFragment = flow(
  RNEA.fromReadonlyArray,
  O.match(
    constant(noActivity),
    flow(
      RA.map(renderActivity),
      RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
      (renderedActivities) => (
        `<ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>`
      ),
    ),
  ),
  toHtmlFragment,
);
