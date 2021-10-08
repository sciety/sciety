import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, flow, pipe } from 'fp-ts/function';
import { PageOfArticles, paginate } from './paginate';
import { renderEvaluatedArticlesList } from './render-evaluated-articles-list';
import { noArticlesCanBeFetchedMessage, noEvaluatedArticlesMessage } from './static-messages';
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

const toArticleCardViewModel = (ports: Ports) => (evaluatedArticle: ArticleActivity) => pipe(
  evaluatedArticle.doi,
  getArticleDetails(ports),
  TO.map((articleDetails) => ({
    ...evaluatedArticle,
    ...articleDetails,
    latestVersionDate: articleDetails.latestVersionDate,
    latestActivityDate: O.some(evaluatedArticle.latestActivityDate),
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

const renderPageNumbers = (page: O.Option<number>, articleCount: number, numberOfPages: number) => pipe(
  articleCount,
  O.fromPredicate(() => articleCount > 0),
  O.fold(
    constant(''),
    () => pipe(
      page,
      O.getOrElse(() => 1),
      (currentPage) => `<p class="evaluated-articles__page_count">Showing page ${currentPage} of ${numberOfPages}<span class="visually-hidden"> pages of list content</span></p>`,
    ),
  ),
);

const toPageOfCards = (ports: Ports, group: Group) => (pageOfArticles: PageOfArticles) => pipe(
  pageOfArticles.items,
  E.fromPredicate(RA.isNonEmpty, () => noEvaluatedArticlesMessage),
  TE.fromEither,
  TE.chainTaskK(T.traverseArray(toArticleCardViewModel(ports))),
  TE.map(RA.rights),
  TE.map(RA.match(
    () => noArticlesCanBeFetchedMessage,
    flow(
      renderEvaluatedArticlesList,
      addPaginationControls(pageOfArticles.nextPage, group),
      (content) => `${renderPageNumbers(O.some(pageOfArticles.pageNumber), pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}${content}`,
      toHtmlFragment,
    ),
  )),
  TE.toUnion,
);

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (articles, group, pageNumber, pageSize) => pipe(
  articles,
  paginate(pageNumber, pageSize),
  TE.fromEither,
  TE.chainTaskK(toPageOfCards(ports, group)),
);
