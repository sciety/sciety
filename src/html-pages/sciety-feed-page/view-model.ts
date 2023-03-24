import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment';

type ScietyFeedCardDetails = {
  title: HtmlFragment,
  content: HtmlFragment,
};

export type ScietyFeedCard = {
  titleText: string,
  linkUrl: string,
  avatarUrl: string,
  date: Date,
  details?: ScietyFeedCardDetails,
};

export type ViewModel = {
  cards: ReadonlyArray<HtmlFragment>,
  nextPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
};
