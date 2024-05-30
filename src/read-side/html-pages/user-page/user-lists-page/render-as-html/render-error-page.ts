import { pipe } from 'fp-ts/function';
import * as DE from '../../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../../types/html-fragment';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => pipe(
  e,
  DE.match({
    notFound: () => 'User not found',
    unavailable: () => 'User information unavailable',
    notAuthorised: () => 'You aren\'t permitted to do that.',
  }),
  toHtmlFragment,
  (message) => toErrorPageBodyViewModel({
    type: e,
    message,
  }),
);
