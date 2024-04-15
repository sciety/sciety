import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../../types/html-fragment';
import { RawUserInput } from '../../read-side';

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
