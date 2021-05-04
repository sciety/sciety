import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';

export type ArticleViewModel = {
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

type RenderAuthors = (authors: ReadonlyArray<string>, authorListId: string) => HtmlFragment;

const renderAuthors: RenderAuthors = (authors, authorListId) => pipe(
  authors,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    flow(
      RNEA.map((author) => `<li class="article-card__author">${htmlEscape(author)}</li>`),
      (authorListItems) => `
      <div class="hidden" id="${authorListId}">This article's authors</div>
      <ol class="article-card__authors" role="list" aria-describedby="${authorListId}">
        ${authorListItems.join('')}
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

export const renderArticleCard = (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <article class="article-card">
    <h3 class="article-card__title">
      <a class="article-card__link" href="/articles/activity/${model.doi.value}">${model.title}</a>
    </h3>
    ${renderAuthors(model.authors, `article-card-author-list-${model.doi.value}`)}
    <div class="article-card__meta">
      <span class="visually-hidden">This article has </span>${renderEvaluationCount(model.evaluationCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityDate)}
    </div>
  </article>
`);
