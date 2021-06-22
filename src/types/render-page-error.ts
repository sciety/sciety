import * as DE from './data-error';
import { HtmlFragment } from './html-fragment';

export type RenderPageError = {
  type: DE.DataError,
  message: HtmlFragment,
};
