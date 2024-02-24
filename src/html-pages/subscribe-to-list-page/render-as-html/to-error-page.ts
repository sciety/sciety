import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model.js';

export const toErrorPage = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: DE.notFound,
  message: pipe('Something went wrong', toHtmlFragment),
});
