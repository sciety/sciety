import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { templateDate } from './date';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type ArticleViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  latestVersionDate: O.Option<Date>,
  latestActivityDate: O.Option<Date>,
  evaluationCount: number,
};

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
      <ol class="group-activity-list__card_authors" role="list" aria-describedby="group-activity-list-authors">
        ${authors.join('\n')}
      </ol>
    `,
    ),
  ),
  toHtmlFragment,
);

const renderArticleVersionDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest version ${date}`,
    wrapInSpan,
  ),
);

const renderArticleLatestActivityDate = O.fold(
  constant(''),
  flow(
    templateDate,
    (date) => `Latest activity ${date}`,
    wrapInSpan,
  ),
);

export const renderArticleActivity = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <article class="group-activity-list__card">
    <h3 class="group-activity-list__card_title">
      <a class="group-activity-list__card_link" href="/articles/activity/${model.doi.value}">${model.title}</a>
    </h3>
    ${renderAuthors(model.authors)}
    <div class="group-activity-list__card_meta">
      <span class="visually-hidden">This article has </span>${renderEvaluationCount(model.evaluationCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityDate)}
    </div>
  </article>
`);
