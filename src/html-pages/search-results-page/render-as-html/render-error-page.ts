import * as DE from '../../../types/data-error.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ErrorPageBodyViewModel } from '../../../types/render-page-error.js';

export const renderErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});
