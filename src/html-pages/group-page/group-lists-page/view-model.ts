import { ListCardViewModel } from '../../../shared-components/list-card/render-list-card';
import { ContentModel } from './content-model';

export type ListsTab = {
  selector: 'lists',
  lists: ReadonlyArray<ListCardViewModel>,
};

export type ViewModel = ContentModel & {
  isFollowing: boolean,
  activeTab: ListsTab,
};
