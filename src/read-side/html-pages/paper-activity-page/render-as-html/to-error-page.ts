import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';

export const toErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => toErrorPageBodyViewModel({
  type: error,
  message: toHtmlFragment(`
    The title and authors for this article are not available from our external data provider.
    We will be able to show you this page once the data becomes available.
    We are sorry for the inconvenience. <a href="https://form.jotform.com/Sciety/error">Report this error to us.</a>
  `),
});
