import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../../read-models/lists';
import { Group } from '../../../../../types/group';
import * as LOID from '../../../../../types/list-owner-id';
import { UserId } from '../../../../../types/user-id';
import { constructGroupPagePath } from '../../../../paths';
import { ListsThatCanBeFeatured } from '../view-model';

const excludeListsAlreadyFeaturedByTheGroup = (lists: ReadonlyArray<List>) => lists;

export const constructListsThatCanBeFeatured = (
  dependencies: Dependencies,
  group: Group,
  userId: UserId,
): ListsThatCanBeFeatured => pipe(
  userId,
  LOID.fromUserId,
  dependencies.selectAllListsOwnedBy,
  excludeListsAlreadyFeaturedByTheGroup,
  RA.map((list) => ({
    listName: list.name,
    listId: list.id,
    forGroup: group.id,
    successRedirectPath: constructGroupPagePath.management.href(group),
  })),
);
