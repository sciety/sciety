import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Group } from '../../../../../types/group';
import { constructGroupPagePath } from '../../../../paths/construct-group-page-href';
import { ListsThatCanBeFeatured } from '../view-model';

export const constructListsThatCanBeFeatured = (
  dependencies: Dependencies,
  group: Group,
): ListsThatCanBeFeatured => pipe(
  dependencies.getNonEmptyUserLists(),
  RA.map((list) => ({
    listName: list.name,
    listId: list.id,
    forGroup: group.id,
    successRedirectPath: constructGroupPagePath.management.href(group),
  })),
);
