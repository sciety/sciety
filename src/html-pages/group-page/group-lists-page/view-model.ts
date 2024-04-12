import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { HeaderViewModel } from '../sub-page-header';

export type ViewModel = {
  header: HeaderViewModel,
  listCards: ReadonlyArray<ListCardViewModel>,
  listCount: number,
};
