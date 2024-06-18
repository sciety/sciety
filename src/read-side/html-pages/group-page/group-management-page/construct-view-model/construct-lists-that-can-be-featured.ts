import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../../read-models/lists';
import { Group } from '../../../../../types/group';
import { GroupId } from '../../../../../types/group-id';
import { ListId } from '../../../../../types/list-id';
import * as LOID from '../../../../../types/list-owner-id';
import { UserId } from '../../../../../types/user-id';
import { constructGroupPagePath } from '../../../../paths';
import { ListsThatCanBeFeatured } from '../view-model';

const exclude = (
  featuredLists: ReadonlyArray<ListId>,
) => (
  userLists: ReadonlyArray<List>,
) => pipe(
  userLists,
  RA.filter((list) => !featuredLists.includes(list.id)),
);

const listsAlreadyFeaturedByTheGroup = (groupId: GroupId, dependencies: Dependencies) => pipe(
  groupId,
  dependencies.selectAllListsPromotedByGroup,
  RA.map((list) => list.id),
);

export const constructListsThatCanBeFeatured = (
  dependencies: Dependencies,
  group: Group,
  userId: UserId,
): ListsThatCanBeFeatured => pipe(
  userId,
  LOID.fromUserId,
  dependencies.selectAllListsOwnedBy,
  exclude(listsAlreadyFeaturedByTheGroup(group.id, dependencies)),
  RA.map((list) => ({
    listName: list.name,
    listId: list.id,
    forGroup: group.id,
    successRedirectPath: constructGroupPagePath.management.href(group),
  })),
);
