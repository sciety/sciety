import { pipe } from 'fp-ts/function';
import { match } from 'ts-adt';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

export const renderErrorPage = (e: DE.DataError): RenderPageError => pipe(
  e,
  match({
    notFound: () => 'User not found',
    unavailable: () => 'User information unavailable',
  }),
  toHtmlFragment,
  (message) => ({
    type: e,
    message,
  }),
);
