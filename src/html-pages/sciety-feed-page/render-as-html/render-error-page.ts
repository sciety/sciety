import * as DE from '../../../types/data-error.js';
import { toHtmlFragment } from '../../../types/html-fragment.js';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../types/error-page-body-view-model.js';

export const renderErrorPage = (e: DE.DataError): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: e,
  message: toHtmlFragment('We couldn\'t find that information.'),
});
