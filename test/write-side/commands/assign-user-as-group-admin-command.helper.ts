import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const arbitraryAssignUserAsGroupAdminCommand = () => ({
  userId: arbitraryUserId(),
  groupId: arbitraryGroupId(),
});
