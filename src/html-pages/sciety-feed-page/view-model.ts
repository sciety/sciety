import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  cards: ReadonlyArray<HtmlFragment>,
  nextPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
};
