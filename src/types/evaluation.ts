import { URL } from 'url';
import { SanitisedHtmlFragment } from './sanitised-html-fragment.js';

export type Evaluation = {
  fullText: SanitisedHtmlFragment,
  url: URL,
};
