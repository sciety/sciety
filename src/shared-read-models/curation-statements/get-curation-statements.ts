import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import { CurationStatement, ReadModel } from './handle-event';

type GetCurationStatements = (readmodel: ReadModel) => (articleId: Doi) => ReadonlyArray<CurationStatement>;

export const getCurationStatements: GetCurationStatements = (readmodel) => (articleId) => pipe(
  readmodel,
  R.lookup(articleId.value),
  O.getOrElseW(() => []),
);
