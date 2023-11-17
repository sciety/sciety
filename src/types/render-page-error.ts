import * as DE from './data-error.js';
import { HtmlFragment } from './html-fragment.js';

export type ErrorPageBodyViewModel = {
  type: DE.DataError,
  message: HtmlFragment,
};
