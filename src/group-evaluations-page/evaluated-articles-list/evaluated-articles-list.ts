import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { PageOfArticles, paginate } from './paginate';
import { renderEvaluatedArticlesList } from './render-evaluated-articles-list';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { paginationControls } from '../../shared-components/pagination-controls';
import { ArticleActivity } from '../../types/article-activity';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

export type Ports = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
};

const getArticleDetails = (ports: Ports) => fetchArticleDetails(
  getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
  flow(ports.fetchArticle, T.map(O.fromEither)),
);

const noEvaluatedArticles = toHtmlFragment('<p class="evaluated-articles__empty">It looks like this group hasn’t evaluated any articles yet. Try coming back later!</p>');

const articleDetailsUnavailable = toHtmlFragment('<p class="static-message">This information can not be found.</p>');

const addArticleDetails = (ports: Ports) => <A extends { doi: Doi }>(evaluatedArticle: A) => pipe(
  evaluatedArticle.doi,
  getArticleDetails(ports),
  TO.map((articleDetails) => ({
    ...evaluatedArticle,
    ...articleDetails,
  })),
  TE.fromTaskOption(() => DE.unavailable),
);

type EvaluatedArticlesList = (
  ports: Ports
) => (
  articles: ReadonlyArray<ArticleActivity>,
  group: Group,
  pageNumber: number,
  pageSize: number
) => TE.TaskEither<DE.DataError, HtmlFragment>;

const addPaginationControls = (nextPageNumber: O.Option<number>, group: Group) => flow(
  (pageOfContent: HtmlFragment) => `
    <div>
      ${pageOfContent}
      ${(pipe(
    nextPageNumber,
    O.fold(
      () => '',
      (p) => paginationControls(`/groups/${group.slug}/evaluated-articles?page=${p}`),
    ),
  ))}
    </div>
  `,
  toHtmlFragment,
);

const toHtml = (ports: Ports, group: Group) => (pageOfArticles: PageOfArticles) => pipe(
  pageOfArticles.content,
  E.fromPredicate(RA.isNonEmpty, () => 'no-evaluated-articles' as const),
  TE.fromEither,
  TE.chainW(flow(
    T.traverseArray(addArticleDetails(ports)),
    T.map(RA.rights),
    T.map(E.fromPredicate(RA.isNonEmpty, () => DE.unavailable)),
  )),
  TE.match(
    (left) => (left === 'unavailable'
      ? articleDetailsUnavailable
      : noEvaluatedArticles),
    flow(
      RA.map((articleViewModel) => ({
        ...articleViewModel,
        latestVersionDate: articleViewModel.latestVersionDate,
        latestActivityDate: O.some(articleViewModel.latestActivityDate),
      })),
      renderEvaluatedArticlesList,
      addPaginationControls(pageOfArticles.nextPageNumber, group),
    ),
  ),
);

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (articles, group, pageNumber, pageSize) => pipe(
  articles,
  paginate(pageNumber, pageSize),
  TE.fromEither,
  TE.chainTaskK(toHtml(ports, group)),
);
