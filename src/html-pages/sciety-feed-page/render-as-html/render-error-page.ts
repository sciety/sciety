import * as DE from '../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../types/html-fragment';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: e,
  message: toHtmlFragment('We couldn\'t find that information.'),
});
