import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';

export const renderErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});
