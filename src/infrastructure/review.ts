import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import { Maybe } from 'true-myth';
import { HtmlFragment } from '../types/html-fragment';

export interface Review {
  publicationDate: Maybe<Date>;
  fullText: O.Option<HtmlFragment>;
  url: URL;
}
