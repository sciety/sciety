import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe, tupled } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { findGroups, Ports as FindGroupsPorts } from './find-groups';
import { Matches } from './select-subset-to-display';
import * as DE from '../../../types/data-error';
import { ExternalQueries } from '../../../types/external-queries';

export type Ports = FindGroupsPorts & ExternalQueries;

export const paramsCodec = t.type({
  query: t.string,
  category: tt.optionFromNullable(
    t.union([
      t.literal('groups'),
      t.literal('articles'),
    ]),
  ),
  cursor: tt.optionFromNullable(t.string),
  page: tt.optionFromNullable(tt.NumberFromString),
  evaluatedOnly: tt.optionFromNullable(t.unknown),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type PerformAllSearches = (
  ports: Ports,
) => (pageSize: number) => (params: Params) => TE.TaskEither<DE.DataError, Matches>;

export const performAllSearches: PerformAllSearches = (ports) => (pageSize) => (params) => pipe(
  {
    query: TE.right(params.query),
    evaluatedOnly: TE.right(
      pipe(
        params.evaluatedOnly,
        O.isSome,
      ),
    ),
    pageSize: TE.right(pageSize),
    pageNumber: TE.right(params.page),
    category: TE.right(O.getOrElseW(constant('articles' as const))(params.category)),
    articles: pipe(
      [
        params.query,
        params.cursor,
        pipe(
          params.evaluatedOnly,
          O.isSome,
        ),
      ],
      tupled(ports.searchForArticles(pageSize)),
    ),
    groups: pipe(
      findGroups(ports, params.query),
      T.map(RA.map((groupId) => ({ id: groupId }))),
      TE.rightTask,
    ),
  },
  sequenceS(TE.ApplyPar),
);
