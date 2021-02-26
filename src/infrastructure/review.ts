import { URL } from 'url';
import { HtmlFragment } from '../types/html-fragment';

export type Review = {
  fullText: HtmlFragment,
  url: URL,
};
