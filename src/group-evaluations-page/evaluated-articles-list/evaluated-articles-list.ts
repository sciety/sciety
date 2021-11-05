import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { renderEvaluatedArticlesList } from './render-evaluated-articles-list';
import { noArticlesCanBeFetchedMessage, noEvaluatedArticlesMessage } from './static-messages';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { PageOfItems, paginate } from '../../shared-components/paginate';
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
  TE.fromTaskOption(() => ({
    ...evaluatedArticle,
    href: `/articles/${evaluatedArticle.doi.value}`,
    latestActivityDate: O.some(evaluatedArticle.latestActivityDate),
  })),
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

const renderPageNumbers = (page: number, articleCount: number, numberOfPages: number) => (
  articleCount > 0
    ? `<p class="evaluated-articles__page_count">
        Showing page ${page} of ${numberOfPages}<span class="visually-hidden"> pages of list content</span>
      </p>`
    : ''
);

const toPageOfCards = (ports: Ports, group: Group) => (pageOfArticles: PageOfItems<ArticleActivity>) => pipe(
  pageOfArticles.items,
  E.fromPredicate(RA.isNonEmpty, () => noEvaluatedArticlesMessage),
  TE.fromEither,
  TE.chainTaskK(T.traverseArray(toArticleCardViewModel(ports))),
  TE.chainEitherK(E.fromPredicate(RA.some(E.isRight), () => noArticlesCanBeFetchedMessage)),
  TE.map(flow(
    renderEvaluatedArticlesList,
    addPaginationControls(pageOfArticles.nextPage, group),
    (content) => `
      ${renderPageNumbers(pageOfArticles.pageNumber, pageOfArticles.numberOfOriginalItems, pageOfArticles.numberOfPages)}
      ${content}
    `,
    toHtmlFragment,
  )),
  TE.toUnion,
);

const emptyPage = (pageNumber: number) => E.right({
  items: [],
  nextPage: O.none,
  pageNumber,
  numberOfOriginalItems: 0,
  numberOfPages: 0,
});

export const evaluatedArticlesList: EvaluatedArticlesList = (ports) => (articles, group, pageNumber, pageSize) => pipe(
  articles,
  RA.match(
    () => emptyPage(pageNumber),
    paginate(pageSize, pageNumber),
  ),
  TE.fromEither,
  TE.chainTaskK(toPageOfCards(ports, group)),
);
