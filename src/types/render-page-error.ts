import * as DE from './data-error';
import { HtmlFragment } from './html-fragment';

export type ErrorPageBodyViewModel = {
  type: DE.DataError,
  message: HtmlFragment,
};
