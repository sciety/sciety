import { Group } from '../../src/types/group';
import { UserDetails } from '../../src/types/user-details';
import { callApi } from './call-api.helper';

export const addGroup = async (group: Group) => callApi('api/add-group', {
  ...group,
  groupId: group.id,
});

export const createUser = async (userDetails: UserDetails) => callApi('api/create-user', {
  ...userDetails,
  userId: userDetails.id,
});
