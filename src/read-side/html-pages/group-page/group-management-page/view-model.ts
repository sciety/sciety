import { List } from '../../../../read-models/lists';
import { GroupId } from '../../../../types/group-id';

export type ViewModel = {
  pageHeading: string,
  groupId: GroupId,
  successRedirectPath: string,
  groupHomePageHref: string,
  featuredLists: ReadonlyArray<List>,
};
