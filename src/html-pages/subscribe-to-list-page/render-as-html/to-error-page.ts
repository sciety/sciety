import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../types/html-fragment';

export const toErrorPage = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: DE.notFound,
  message: pipe('Something went wrong', toHtmlFragment),
});
