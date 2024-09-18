import { GroupId } from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ApiData } from '../render-as-json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (dependencies: DependenciesForViews) => (groupId: GroupId): ApiData => ({
  groupId,
});
