import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';

export const renderErrorPage = (type: DE.DataError): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  message: toHtmlFragment('The selected page does not exist.'),
  type,
});
