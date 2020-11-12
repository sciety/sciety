import { URL } from 'url';
import { Maybe } from 'true-myth';
import { HtmlFragment } from '../types/html-fragment';

export interface Review {
  publicationDate: Maybe<Date>;
  fullText: Maybe<HtmlFragment>;
  url: URL;
}
