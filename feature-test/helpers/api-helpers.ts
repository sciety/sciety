import { UserDetails } from '../../src/types/user-details';
import { callApi } from './call-api.helper';

export const createUser = async (userDetails: UserDetails) => callApi('api/create-user', {
  ...userDetails,
  userId: userDetails.id,
});
