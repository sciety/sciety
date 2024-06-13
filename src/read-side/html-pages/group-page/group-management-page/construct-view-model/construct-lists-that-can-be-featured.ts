import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Group } from '../../../../../types/group';
import { UserId } from '../../../../../types/user-id';
import { constructGroupPagePath } from '../../../../paths';
import { ListsThatCanBeFeatured } from '../view-model';

export const constructListsThatCanBeFeatured = (
  dependencies: Dependencies,
  group: Group,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userId: UserId,
): ListsThatCanBeFeatured => pipe(
  dependencies.getNonEmptyUserLists(),
  RA.map((list) => ({
    listName: list.name,
    listId: list.id,
    forGroup: group.id,
    successRedirectPath: constructGroupPagePath.management.href(group),
  })),
);
