import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { ArticleItem } from './data-types';
import {
  fetchExtraDetails, FindReviewsForArticleDoi, GetAllEvents, GetGroup,
} from './fetch-extra-details';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { GroupId } from '../types/group-id';

type ArticleResults = {
  items: ReadonlyArray<Omit<ArticleItem, '_tag'>>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', ArticleResults>;

type FindGroups = (q: string) => T.Task<ReadonlyArray<GroupId>>;

type Ports = {
  findGroups: FindGroups,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
  searchEuropePmc: FindArticles,
};

const tagAsArticles = (results: ArticleResults) => ({
  ...results,
  items: results.items.map((article) => ({
    _tag: 'Article' as const,
    ...article,
  })),
});

const tagAsGroups = RA.map((groupId: GroupId) => ({
  _tag: 'Group' as const,
  id: groupId,
}));

type Params = {
  query: string,
};

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => flow(
  (params) => pipe({
    query: TE.right(params.query),
    articles: pipe(
      params.query,
      ports.searchEuropePmc,
      TE.map(tagAsArticles),
    ),
    groups: pipe(
      params.query,
      ports.findGroups, // TODO: should only ask for 10 of n; should return a TE
      T.map(tagAsGroups),
      TE.rightTask,
    ),
  }),
  sequenceS(TE.taskEither),
  TE.map(selectSubsetToDisplay(10)),
  TE.chainW(flow(fetchExtraDetails({ ...ports, getLatestArticleVersionDate: () => T.of(O.none) }), TE.rightTask)),
  TE.bimap(renderErrorPage, renderPage),
);
