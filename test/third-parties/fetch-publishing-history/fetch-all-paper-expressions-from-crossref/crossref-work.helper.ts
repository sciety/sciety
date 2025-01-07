import { PostedContent } from '../../../../src/third-parties/fetch-publishing-history/fetch-all-paper-expressions-from-crossref/crossref-work';
import { arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

export const arbitraryPostedContentCrossrefWork = (): PostedContent => ({
  type: 'posted-content',
  DOI: arbitraryExpressionDoi(),
  posted: { 'date-parts': [[2021, 10, 3]] },
  resource: { primary: { URL: arbitraryUri() } },
  relation: { },
});
