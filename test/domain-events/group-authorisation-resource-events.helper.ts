import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

export const arbitraryUserAssignedAsAdminOfGroupEvent = (): EventOfType<'UserAssignedAsAdminOfGroup'> => constructEvent('UserAssignedAsAdminOfGroup')(
  {
    groupId: arbitraryGroupId(),
    userId: arbitraryUserId(),
  },
);
