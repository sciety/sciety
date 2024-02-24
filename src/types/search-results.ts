import * as O from 'fp-ts/Option';
import { ExpressionDoi } from './expression-doi.js';

export type SearchResults = {
  items: ReadonlyArray<ExpressionDoi>,
  total: number,
  nextCursor: O.Option<string>,
};
