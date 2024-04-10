import { buildPaginationHref } from './build-pagination-href';
import { PageOfItems } from './paginate';
import { ViewModel } from './render-pagination-controls';

export const constructDefaultPaginationControls = (
  path: string,
  pageOfItems: PageOfItems<unknown>,
): ViewModel => ({
  backwardPageHref: buildPaginationHref(path, pageOfItems.prevPage),
  forwardPageHref: buildPaginationHref(path, pageOfItems.nextPage),
  page: pageOfItems.pageNumber,
  pageCount: pageOfItems.numberOfPages,
});
