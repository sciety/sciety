import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';

export const toErrorPage = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: DE.notFound,
  message: pipe('Something went wrong', toHtmlFragment),
});
