import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';

export const renderErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});
