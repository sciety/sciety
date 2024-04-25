import { PaginationControlsViewModel } from '../../../html-pages/shared-components/pagination';
import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';

export type ViewModel = {
  listCards: ReadonlyArray<ListCardViewModel>,
  pagination: PaginationControlsViewModel,
};
