import { GroupId } from '../../../../types/group-id';

export type ViewModel = {
  pageHeading: string,
  groupId: GroupId,
  successRedirectPath: string,
  authorizationToken: string,
};
