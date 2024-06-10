import { List } from '../../../../read-models/lists';
import { GroupId } from '../../../../types/group-id';
import { ListId } from '../../../../types/list-id';

export type ViewModel = {
  pageHeading: string,
  groupId: GroupId,
  successRedirectPath: string,
  groupHomePageHref: string,
  featuredLists: ReadonlyArray<{
    listName: string,
    listId: ListId,
    forGroup: GroupId,
    successRedirectPath: string,
  }>,
  listsThatCanBeFeatured: ReadonlyArray<List>,
};
