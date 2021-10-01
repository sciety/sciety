import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { PageOfArticles, paginate } from './paginate';
import { renderEvaluatedArticlesList } from './render-evaluated-articles-list';
import { articleDetailsUnavailable, noEvaluatedArticles } from './static-messages';
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

const renderPageNumbers = (page: O.Option<number>, articleCount: number, pageSize: number) => pipe(
  articleCount,
  O.fromPredicate(() => articleCount > 0),
  O.fold(
    constant(''),
    (count) => pipe(
      {
        currentPage: pipe(page, O.getOrElse(() => 1)),
        totalPages: Math.ceil(count / pageSize),
      },
      ({ currentPage, totalPages }) => `<p class="evaluated-articles__page_count">Showing page ${currentPage} of ${totalPages}<span class="visually-hidden"> pages of list content</span></p>`,
    ),
  ),
);

const toHtml = (ports: Ports, group: Group) => (pageOfArticles: PageOfArticles) => pipe(
  pageOfArticles.content,
  E.fromPredicate(RA.isNonEmpty, () => noEvaluatedArticles),
  TE.fromEither,
  TE.chainW(flow(
    T.traverseArray(addArticleDetails(ports)),
    T.map(RA.rights),
    T.map(E.fromPredicate(RA.isNonEmpty, () => articleDetailsUnavailable)),
  )),
  TE.map(flow(
    RA.map((articleViewModel) => ({
      ...articleViewModel,
      latestVersionDate: articleViewModel.latestVersionDate,
      latestActivityDate: O.some(articleViewModel.latestActivityDate),
    })),
    renderEvaluatedArticlesList,
    addPaginationControls(pageOfArticles.nextPageNumber, group),
    (content) => `${renderPageNumbers(O.some(pageOfArticles.currentPageNumber), pageOfArticles.articleCount, pageOfArticles.pageSize)}${content}`,
    toHtmlFragment,
  )),
  TE.toUnion,
);

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (articles, group, pageNumber, pageSize) => pipe(
  articles,
  paginate(pageNumber, pageSize),
  TE.fromEither,
  TE.chainTaskK(toHtml(ports, group)),
);
