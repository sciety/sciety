import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
import { renderCountWithDescriptor } from '../render-count-with-descriptor';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { templateDate } from '../date';
import { renderAuthors } from '../render-card-authors';
import { ArticleCardViewModel } from './view-model';
import { renderCurationStatements } from './render-curation-statements';
import { renderReviewingGroupsWithLink } from './render-reviewing-groups-with-link';

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderEvaluationCount = (evaluationCount: ArticleCardViewModel['evaluationCount']) => pipe(
  evaluationCount,
  O.fold(
    () => '<span class="visually-hidden">This article has no evaluations</span>',
    (count) => pipe(
      renderCountWithDescriptor(count, 'evaluation', 'evaluations'),
      wrapInSpan,
      (content) => `<span class="visually-hidden">This article has </span>${content}`,
    ),
  ),
);

const renderListMembershipCount = (listMembershipCount: ArticleCardViewModel['listMembershipCount']) => pipe(
  listMembershipCount,
  O.fold(
    constant(''),
    (count) => pipe(
      `Appears in ${renderCountWithDescriptor(count, 'list', 'lists')}`,
      wrapInSpan,
    ),
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

const renderMeta = (model: ArticleCardViewModel) => `
  <div class="article-card__meta">
    ${renderEvaluationCount(model.evaluationCount)}${renderListMembershipCount(model.listMembershipCount)}${renderArticleVersionDate(model.latestVersionDate)}${renderArticleLatestActivityDate(model.latestActivityAt)}
  </div>
`;

export const renderArticleCardContents = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <h3 class="article-card__title"><a href="${model.articleLink}">${model.title}</a></h3>
  ${renderAuthors(model.authors)}
  ${renderCurationStatements(model.curationStatementsTeasers)}
  ${renderReviewingGroupsWithLink(model.reviewingGroups)}
  <footer class="article-card__footer">
    ${renderMeta(model)}
  </footer>
`);

export const renderArticleCard = (model: ArticleCardViewModel): HtmlFragment => toHtmlFragment(`
  <section class="article-card">
    ${renderArticleCardContents(model)}
  </section>
`);
