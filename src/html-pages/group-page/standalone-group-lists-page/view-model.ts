import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { ViewModel as HeaderViewModel } from '../sub-page-header/render-page-header';

export type ViewModel = {
  header: HeaderViewModel,
  listCards: ReadonlyArray<ListCardViewModel>,
};
