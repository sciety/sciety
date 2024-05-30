import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ErrorPageViewModel = {
  tag: 'error-page-view-model',
  type: DE.DataError,
  message: HtmlFragment,
};

export const toErrorPageViewModel = (partial: Omit<ErrorPageViewModel, 'tag'>): ErrorPageViewModel => ({
  ...partial,
  tag: 'error-page-view-model',
});

export const constructErrorPageViewModel = (e: DE.DataError): ErrorPageViewModel => pipe(
  e,
  DE.match({
    notFound: () => 'We couldn\'t find this information.',
    unavailable: () => 'We couldn\'t retrieve this information. Please try again.',
    notAuthorised: () => 'You aren\'t permitted to do that.',
  }),
  toHtmlFragment,
  (message) => toErrorPageViewModel({
    type: e,
    message,
  }),
);
