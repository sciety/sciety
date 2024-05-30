import { GroupCardViewModel } from '../shared-components/group-card';

export type ViewModel = {
  title: string,
  groupCards: ReadonlyArray<GroupCardViewModel>,
};
