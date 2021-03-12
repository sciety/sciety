import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchStaticFile, findGroups } from './find-groups';
import { projectGroupMeta } from './project-group-meta';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleSearchResult, renderSearchResult } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import {
  FindReviewsForArticleDoi,
  GetAllEvents, GetGroup, search,
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
  search(
    ports.searchEuropePmc,
    findGroups(ports.fetchStaticFile, bootstrapEditorialCommunities),
    ports.getGroup,
    ports.findReviewsForArticleDoi,
    projectGroupMeta(ports.getAllEvents),
  ),
  TE.map((searchResults) => renderSearchResults(renderSearchResult)(params.query, searchResults)),
  TE.bimap(renderErrorPage, renderPage(params.query)),
);
