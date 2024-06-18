import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { Group } from '../../../../../types/group';
import { GroupId } from '../../../../../types/group-id';
import { constructGroupPagePath } from '../../../../paths';
import { calculateListCount } from '../../common-components/calculate-list-count';
import { ViewModel } from '../view-model';

const constructGroupListsPageHref = (group: Group, dependencies: Dependencies) => pipe(
  group.id,
  calculateListCount(dependencies),
  (listCount) => (listCount === 1
    ? O.none
    : O.some(constructGroupPagePath.lists.href(group))),
);

const checkFollowingStatus = (user: Params['user'], dependencies: Dependencies, groupId: GroupId) => pipe(
  user,
  O.match(
    () => false,
    (u) => dependencies.isFollowing(groupId)(u.id),
  ),
);

const showManagementLinkToAdmins = (dependencies: Dependencies, user: Params['user'], group: Group) => pipe(
  user,
  O.map(({ id }) => id),
  O.filter((userId) => dependencies.isUserAdminOfGroup(userId, group.id)),
  O.map(() => constructGroupPagePath.management.href(group)),
);

export const constructHeader = (dependencies: Dependencies, user: Params['user']) => (group: Group): ViewModel['header'] => ({
  group,
  isFollowing: checkFollowingStatus(user, dependencies, group.id),
  followerCount: RA.size(dependencies.getFollowers(group.id)),
  groupAboutPageHref: constructGroupPagePath.about.href(group),
  groupListsPageHref: constructGroupListsPageHref(group, dependencies),
  groupFollowersPageHref: constructGroupPagePath.followers.href(group),
  managementPageHref: showManagementLinkToAdmins(dependencies, user, group),
});
