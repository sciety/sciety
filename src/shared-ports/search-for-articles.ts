import * as O from 'fp-ts/Option';
import { ExpressionDoi } from '../types/expression-doi';

export type SearchResults = {
  items: ReadonlyArray<ExpressionDoi>,
  total: number,
  nextCursor: O.Option<string>,
};
