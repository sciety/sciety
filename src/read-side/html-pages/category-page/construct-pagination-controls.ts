import * as O from 'fp-ts/Option';
import { Params } from './params';
import { PaginatedCards } from './view-model';
import { constructCategoryPageHref } from '../../../standards/paths';

const calculateForwardPageHref = (params: Params) => O.some(constructCategoryPageHref(params.categoryName, 2));

export const constructPaginationControls = (pageSize: number, params: Params, totalItems: number): PaginatedCards['paginationControls'] => ({
  backwardPageHref: O.some('/backward-page-href'),
  forwardPageHref: calculateForwardPageHref(params),
  page: params.page,
  pageCount: Math.ceil(totalItems / pageSize),
});
