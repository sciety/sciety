import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { HtmlFragment } from '../types/html-fragment';

export type Review = {
  fullText: O.Option<HtmlFragment>,
  url: URL,
};
