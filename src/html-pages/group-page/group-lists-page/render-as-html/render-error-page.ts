import { pipe } from 'fp-ts/function';
import * as DE from '../../../../types/data-error.js';
import { toHtmlFragment } from '../../../../types/html-fragment.js';
import { ErrorPageBodyViewModel } from '../../../../types/render-page-error.js';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => pipe(
  e,
  DE.match({
    notFound: () => 'No such group. Please check and try again.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);
