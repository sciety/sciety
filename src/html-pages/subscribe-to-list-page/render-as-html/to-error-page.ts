import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error';

export const toErrorPage = (): ErrorPageBodyViewModel => ({
  type: DE.notFound,
  message: pipe('Something went wrong', toHtmlFragment),
});
