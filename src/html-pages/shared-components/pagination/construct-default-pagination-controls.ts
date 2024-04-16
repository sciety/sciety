import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { PageOfItems } from './paginate';
import { ViewModel } from './render-pagination-controls';
import { queryStringParameters } from '../../../standards';

const buildPaginationHref = (path: string, pageNumber: O.Option<number>): O.Option<string> => pipe(
  pageNumber,
  O.map((number) => `${path}?${queryStringParameters.page}=${number}`),
);

export const constructDefaultPaginationControls = (
  path: string,
  pageOfItems: PageOfItems<unknown>,
): ViewModel => ({
  backwardPageHref: buildPaginationHref(path, pageOfItems.backwardPage),
  forwardPageHref: buildPaginationHref(path, pageOfItems.forwardPage),
  page: pageOfItems.pageNumber,
  pageCount: pageOfItems.numberOfPages,
});
