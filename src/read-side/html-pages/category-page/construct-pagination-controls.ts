import * as O from 'fp-ts/Option';
import { Params } from './params';
import { PaginatedCards } from './view-model';
import { constructCategoryPageHref } from '../../../standards/paths';

const calculatePageCount = (totalItems: number, pageSize: number) => Math.ceil(totalItems / pageSize);

const calculateForwardPageHref = (params: Params, totalItems: number, pageSize: number) => {
  const pageCount = calculatePageCount(totalItems, pageSize);
  if (params.page >= pageCount) {
    return O.none;
  }
  const nextPage = params.page + 1;
  return O.some(constructCategoryPageHref(params.categoryName, nextPage));
};

const calculateBackwardPageHref = (params: Params) => {
  if (params.page === 1) {
    return O.none;
  }
  const previousPage = params.page - 1;
  return O.some(constructCategoryPageHref(params.categoryName, previousPage));
};

export const constructPaginationControls = (pageSize: number, params: Params, totalItems: number): PaginatedCards['paginationControls'] => ({
  backwardPageHref: calculateBackwardPageHref(params),
  forwardPageHref: calculateForwardPageHref(params, totalItems, pageSize),
  page: params.page,
  pageCount: calculatePageCount(totalItems, pageSize),
});
