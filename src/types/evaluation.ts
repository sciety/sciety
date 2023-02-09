import { URL } from 'url';
import { HtmlFragment } from './html-fragment';

export type Evaluation = {
  fullText: HtmlFragment,
  url: URL,
};
