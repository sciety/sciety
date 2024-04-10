import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { PageOfItems } from './paginate';
import { ViewModel } from './render-pagination-controls';
import { queryStringProperties } from '../../../standards';

const buildPaginationHref = (path: string, pageNumber: O.Option<number>): O.Option<string> => pipe(
  pageNumber,
  O.map((number) => `${path}?${queryStringProperties.page}=${number}`),
);

export const constructDefaultPaginationControls = (
  path: string,
  pageOfItems: PageOfItems<unknown>,
): ViewModel => ({
  backwardPageHref: buildPaginationHref(path, pageOfItems.prevPage),
  forwardPageHref: buildPaginationHref(path, pageOfItems.nextPage),
  page: pageOfItems.pageNumber,
  pageCount: pageOfItems.numberOfPages,
});
