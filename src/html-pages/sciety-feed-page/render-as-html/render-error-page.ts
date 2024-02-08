import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => ({
  type: e,
  message: toHtmlFragment('We couldn\'t find that information.'),
});
