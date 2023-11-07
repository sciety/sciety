import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { ErrorPageBodyViewModel } from '../../../../types/render-page-error';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => pipe(
  e,
  DE.match({
    notFound: () => 'User not found',
    unavailable: () => 'User information unavailable',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);
