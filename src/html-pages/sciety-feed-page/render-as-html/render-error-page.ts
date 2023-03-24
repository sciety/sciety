import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { RenderPageError } from '../../../types/render-page-error';

export const renderErrorPage = (e: DE.DataError): RenderPageError => ({
  type: e,
  message: toHtmlFragment('We couldn\'t find that information.'),
});
