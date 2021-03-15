import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, findGroups } from './find-groups';
import { projectGroupMeta } from './project-group-meta';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ItemViewModel, renderSearchResult } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import {
  constructGroupResult,
  FindReviewsForArticleDoi,
  GetAllEvents, GetGroup, MatchedArticle, toArticleViewModel,
} from './search';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';

type ArticleSearchResults = {
  items: ReadonlyArray<MatchedArticle>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', ArticleSearchResults>;

type Ports = {
  searchEuropePmc: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
  fetchStaticFile: FetchStaticFile,
};

type Params = {
  query: string,
};

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

/* Solution sketch:

pipe(
  {
    query: params.query,
    groups: findMatchingGroups(ports.fetchStaticFile, bootstrapEditorialCommunities, 10)(params.query),
    articles: ports.searchEuropePmc(params.query, 10),
  },
  sequenceS(TE.taskEither),
  TE.map(selectSubsetToDisplay(10)),
  TE.chain(fetchExtraDetails(ports)),
  TE.bimap(renderErrorPage, renderPage),
)

*/

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  {
    query: TE.right(params.query),
    articles: ports.searchEuropePmc(params.query),
    groups: pipe(
      findGroups(ports.fetchStaticFile, bootstrapEditorialCommunities)(params.query),
      TE.rightTask,
    ),
  },
  sequenceS(TE.taskEither),
  TE.map((state) => ({
    ...state,
    availableMatches: state.groups.length + state.articles.total,
    itemsToDisplay: pipe(
      [
        ...state.groups.map((group) => ({
          _tag: 'Group' as const,
          ...group,
        })),
        ...state.articles.items.map((article) => ({
          _tag: 'Article' as const,
          ...article,
        })),
      ],
      RA.takeLeft(10),
    ),
  })),
  TE.chainW((state) => pipe(
    ({
      query: T.of(state.query),
      availableMatches: T.of(state.availableMatches),
      articles: T.of(state.articles),
      itemsToDisplay: pipe(
        state.itemsToDisplay,
        T.traverseArray((item) => {
          if (item._tag === 'Article') {
            return pipe(
              item,
              // TODO: Find reviewsForArticleDoi should return a TaskEither
              toArticleViewModel(ports.findReviewsForArticleDoi),
              (f) => TE.rightTask<'not-found', ItemViewModel>(f),
            );
          }
          return pipe(
            item,
            constructGroupResult(ports.getGroup, projectGroupMeta(ports.getAllEvents)),
          );
        }),
        T.map(RA.rights),
      ),
    }),
    sequenceS(T.task),
    TE.rightTask,
  )),
  TE.map(renderSearchResults(renderSearchResult)(params.query)),
  TE.bimap(renderErrorPage, renderPage(params.query)),
);
