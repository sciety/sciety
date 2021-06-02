import { URL } from 'url';
import { HtmlFragment } from '../types/html-fragment';

export type Evaluation = {
  fullText: HtmlFragment,
  url: URL,
};
