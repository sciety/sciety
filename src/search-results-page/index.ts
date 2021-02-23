import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { ArticleSearchResult, createRenderSearchResult, GetReviewCount } from './render-search-result';
import { renderSearchResults } from './render-search-results';
import { search } from './search';
import { Doi } from '../types/doi';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toHtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';

type OriginalSearchResults = {
  items: ReadonlyArray<Omit<Omit<ArticleSearchResult, '_tag'>, 'reviewCount'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', OriginalSearchResults>;

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  editorialCommunityId: EditorialCommunityId,
}>>;

type Ports = {
  searchEuropePmc: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
};

type Params = {
  query?: string,
};

type ArticleSearchPage = (params: Params) => ReturnType<RenderPage>;

export const articleSearchPage = (ports: Ports): ArticleSearchPage => {
  const getReviewCount: GetReviewCount = (doi) => pipe(
    ports.findReviewsForArticleDoi(doi),
    T.map((list) => list.length),
    TE.rightTask,
  );
  const renderSearchResult = createRenderSearchResult(getReviewCount);

  return (params) => pipe(
    params.query ?? '', // TODO: use Option
    search(ports.searchEuropePmc),
    TE.chainW(
      flow(
        renderSearchResults(renderSearchResult)(params.query ?? ''),
        TE.rightTask,
      ),
    ),
    TE.map(toHtmlFragment),
    TE.bimap(renderErrorPage, renderPage),
  );
};
