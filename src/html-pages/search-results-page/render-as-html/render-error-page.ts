import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { RenderPageError } from '../../../types/render-page-error';

export const renderErrorPage = (error: DE.DataError): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});
