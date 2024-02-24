import * as DE from './data-error.js';
import { HtmlFragment } from './html-fragment.js';

export type ErrorPageBodyViewModel = {
  tag: 'error-page-body-view-model',
  type: DE.DataError,
  message: HtmlFragment,
};

export const toErrorPageBodyViewModel = (partial: Omit<ErrorPageBodyViewModel, 'tag'>): ErrorPageBodyViewModel => ({
  ...partial,
  tag: 'error-page-body-view-model',
});
