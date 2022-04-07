import * as O from 'fp-ts/Option';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleAuthors } from '../../types/article-authors';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';
import { renderAuthors } from '../render-card-authors';

export type ArticleViewModel = {
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityDate: O.Option<Date>,
  evaluationCount: number,
  listMembershipCount: number,
};

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: number): HtmlFragment => pipe(
  evaluationCount === 1,
  (singular) => `${evaluationCount} ${singular ? 'evaluation' : 'evaluations'}`,
  wrapInSpan,
);

const renderListMembershipCount = (listMembershipCount: number) => pipe(
  listMembershipCount === 0,
  B.fold(
    () => pipe(
      listMembershipCount === 1,
      (singular) => `Appears in ${listMembershipCount} ${singular ? 'list' : 'lists'}`,
      wrapInSpan,
    ),
    constant(''),
  ),
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

const renderControls = (controls: O.Option<HtmlFragment>) => pipe(
  controls,
  O.fold(
    () => '',
    (content) => `<div class="article-card__controls">${content}</div>`,
  ),
);

const renderAnnotationContent = (content: undefined | string) => (
  content !== undefined
    ? `
      <section class="article-card__annotation">
      <h4 class="visually-hidden">Annotation by AvasthiReading</h4>
        ${content}
      </section>
    `
    : '');

export const renderArticleCard = (controls: O.Option<HtmlFragment>, annotationContent?: string) => (model: ArticleViewModel): HtmlFragment => toHtmlFragment(`
  <article class="article-card">
    <section class="article-card__main_content">
        <h3 class="article-card__title">
          <a class="article-card__link" href="/articles/activity/${model.articleId.value}">${model.title}</a>
        </h3>
        ${renderAuthors(model.authors, `article-card-author-list-${model.articleId.value}`)}
        <footer class="article-card__footer">
          <div class="article-card__meta">
            <span class="visually-hidden">This article has </span>${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityDate)}
          </div>
        </footer>
      ${renderControls(controls)}
    </section>
    ${renderAnnotationContent(annotationContent)}
  </article>
`);
