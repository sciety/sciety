import { pipe } from 'fp-ts/function';
import * as DE from '../../../types/data-error.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error.js';

export const toErrorPage = (): ErrorPageBodyViewModel => ({
  type: DE.notFound,
  message: pipe('Something went wrong', toHtmlFragment),
});
