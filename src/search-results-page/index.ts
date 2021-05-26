import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe, tupled } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ArticleItem } from './data-types';
import {
  fetchExtraDetails, FindReviewsForArticleDoi, GetAllEvents, GetGroup,
} from './fetch-extra-details';
import { renderErrorPage, RenderPage, renderPage } from './render-page';
import { selectSubsetToDisplay } from './select-subset-to-display';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

type ArticleResults = {
  items: ReadonlyArray<ArticleItem>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', ArticleResults>;

type FindGroups = (q: string) => T.Task<ReadonlyArray<GroupId>>;

type FindVersionsForArticleDoi = (
  doi: Doi,
  server: ArticleServer,
) => TO.TaskOption<RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>>;

type Ports = {
  findGroups: FindGroups,
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
  searchEuropePmc: FindArticles,
};

export const paramsCodec = t.type({
  query: t.string,
  category: tt.optionFromNullable(
    t.union([
      t.literal('groups'),
      t.literal('articles'),
    ]),
  ),
});

type Params = t.TypeOf<typeof paramsCodec>;

type SearchResultsPage = (params: Params) => ReturnType<RenderPage>;

export const searchResultsPage = (ports: Ports): SearchResultsPage => flow(
  (params) => ({
    query: TE.right(params.query),
    category: TE.right(params.category),
    articles: pipe(
      params.query,
      ports.searchEuropePmc,
    ),
    groups: pipe(
      params.query,
      ports.findGroups, // TODO: should only ask for 10 of n; should return a TE
      T.map(RA.map((groupId) => ({ id: groupId }))),
      TE.rightTask,
    ),
  }),
  sequenceS(TE.ApplyPar),
  TE.map(selectSubsetToDisplay(10)),
  TE.chainTaskK(fetchExtraDetails({
    ...ports,
    getLatestArticleVersionDate: (doi, server) => pipe(
      [doi, server],
      tupled(ports.findVersionsForArticleDoi),
      TO.map(flow(
        RNEA.last,
        (version) => version.occurredAt,
      )),
    ),
  })),
  TE.bimap(renderErrorPage, renderPage),
);
