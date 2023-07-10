import { URL } from 'url';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type Evaluation = {
  fullText: SanitisedHtmlFragment,
  url: URL,
  tags: ReadonlyArray<string>,
};
