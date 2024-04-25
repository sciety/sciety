import { ListCardViewModel } from '../../shared-components/list-card/render-list-card';
import { ViewModel as HeaderViewModel } from '../common-components/render-page-header';

export type ViewModel = {
  header: HeaderViewModel,
  listCards: ReadonlyArray<ListCardViewModel>,
  listCount: number,
};
