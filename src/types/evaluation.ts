import { SanitisedHtmlFragment } from './sanitised-html-fragment';

/**
 * @deprecated Refer to read-side/fetch-evaluation instead, which should be the only producer of this type
 */
export type Evaluation = {
  fullText: SanitisedHtmlFragment,
};
