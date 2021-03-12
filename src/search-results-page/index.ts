import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { FetchStaticFile, findGroups } from './find-groups';
import { projectGroupMeta } from './project-group-meta';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleSearchResult, renderSearchResult } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import {
  addGroupResults,
  FindReviewsForArticleDoi,
  GetAllEvents, GetGroup, toArticleViewModel,
} from './search';
import { bootstrapEditorialCommunities } from '../data/bootstrap-editorial-communities';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

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
  query,
  {
    groups: findMatchingGroups(query),
    articles: findMatchingArticles(query),
  },
  sequenceS(TE.taskEither),
  TE.map(selectSubsetToDisplay),
  TE.chain(fetchExtraDetails),
  TE.bimap(renderErrorPage, renderPage),
)

*/

export const searchResultsPage = (ports: Ports): SearchResultsPage => (params) => pipe(
  params.query,
  ports.searchEuropePmc,
  TE.chainW(flow(
    (searchResults) => pipe(
      searchResults.items,
      T.traverseArray(toArticleViewModel(ports.findReviewsForArticleDoi)),
      T.map((items) => ({
        total: searchResults.total,
        items,
      })),
    ),
    TE.rightTask,
  )),
  TE.chainW(addGroupResults(
    ports.getGroup,
    projectGroupMeta(ports.getAllEvents),
    findGroups(ports.fetchStaticFile, bootstrapEditorialCommunities),
  )(params.query)),
  TE.map((searchResults) => renderSearchResults(renderSearchResult)(params.query, searchResults)),
  TE.bimap(renderErrorPage, renderPage(params.query)),
);
