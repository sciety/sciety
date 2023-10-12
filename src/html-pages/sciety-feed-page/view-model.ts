import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment';

type ScietyFeedCardDetails = {
  title: HtmlFragment,
  content: HtmlFragment,
};

export type ScietyFeedCard = {
  titleText: string,
  feedItemHref: string,
  avatarUrl: string,
  date: Date,
  details?: ScietyFeedCardDetails,
};

export type ViewModel = {
  cards: ReadonlyArray<ScietyFeedCard>,
  nextPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
  pageHeading: string,
};
