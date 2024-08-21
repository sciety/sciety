import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { constructGroupPagePath } from '../../../../../standards/paths';
import { Group } from '../../../../../types/group';
import { CurrentlyFeaturedLists } from '../view-model';

export const constructCurrentlyFeaturedLists = (
  dependencies: Dependencies,
  group: Group,
): CurrentlyFeaturedLists => pipe(
  dependencies.selectAllListsPromotedByGroup(group.id),
  RA.map((list) => ({
    listName: list.name,
    listId: list.id,
    forGroup: group.id,
    successRedirectPath: constructGroupPagePath.management.href(group),
  })),
);
