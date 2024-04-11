import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { Group } from '../../../types/group';
import { PageHeaderViewModel } from '../common-components/page-header';
import { ViewModel as HeaderViewModel } from '../sub-page-header/render-page-header';

export type ViewModel = PageHeaderViewModel & {
  header: HeaderViewModel,
  group: Group,
  listCards: ReadonlyArray<ListCardViewModel>,
};
