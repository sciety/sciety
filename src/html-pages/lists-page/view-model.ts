import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { PaginationControlsViewModel } from '../shared-components/pagination';

export type ViewModel = {
  listCards: ReadonlyArray<ListCardViewModel>,
  pagination: PaginationControlsViewModel,
};
