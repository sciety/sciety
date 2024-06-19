import { AssignUserAsGroupAdminCommand } from '../../../src/write-side/commands';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

export const arbitraryAssignUserAsGroupAdmin = (): AssignUserAsGroupAdminCommand => ({
  userId: arbitraryUserId(),
  groupId: arbitraryGroupId(),
});
