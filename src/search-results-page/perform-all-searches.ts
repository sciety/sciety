import { sequenceS } from 'fp-ts/Apply';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ArticleItem } from './data-types';
import { Matches } from './select-subset-to-display';
import { GroupId } from '../types/group-id';

type ArticleResults = {
  items: ReadonlyArray<ArticleItem>,
  total: number,
};

type FindArticles = (query: string) => TE.TaskEither<'unavailable', ArticleResults>;

type FindGroups = (q: string) => T.Task<ReadonlyArray<GroupId>>;

export type Ports = {
  findGroups: FindGroups,
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

export type Params = t.TypeOf<typeof paramsCodec>;

export const performAllSearches = (ports: Ports) => (params: Params): TE.TaskEither<'unavailable', Matches> => pipe(
  {
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
  },
  sequenceS(TE.ApplyPar),
);
