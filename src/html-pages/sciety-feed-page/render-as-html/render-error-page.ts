import * as DE from '../../../types/data-error.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error.js';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => ({
  type: e,
  message: toHtmlFragment('We couldn\'t find that information.'),
});
