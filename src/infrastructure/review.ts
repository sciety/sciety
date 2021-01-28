import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import { HtmlFragment } from '../types/html-fragment';

export interface Review {
  publicationDate: O.Option<Date>;
  fullText: O.Option<HtmlFragment>;
  url: URL;
}
