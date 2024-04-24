import * as DE from '../../../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../../../types/html-fragment';

export const renderErrorPage = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel(
  {
    type: DE.notFound,
    message: toHtmlFragment('The group does not exist.'),
  },
);
