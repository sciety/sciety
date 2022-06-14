import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  DE.fold({
    notFound: () => 'User not found',
    unavailable: () => 'User information unavailable',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);
