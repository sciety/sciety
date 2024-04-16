import * as O from 'fp-ts/Option';
import { RawUserInput } from '../../read-side';
import { HtmlFragment } from '../../types/html-fragment';

type ScietyFeedCardDetails = {
  title: HtmlFragment,
  content: RawUserInput,
};

export type ScietyFeedCard = {
  titleText: string,
  feedItemHref: string,
  avatarSrc: string,
  date: Date,
  details?: ScietyFeedCardDetails,
};

export type ViewModel = {
  cards: ReadonlyArray<ScietyFeedCard>,
  forwardPage: O.Option<number>,
  numberOfPages: number,
  pageNumber: number,
  pageHeading: string,
};
