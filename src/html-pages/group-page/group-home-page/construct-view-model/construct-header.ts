import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { Group } from '../../../../types/group';
import { ViewModel } from '../view-model';

const constructGroupListsPageHref = (group: Group): O.Option<string> => O.some(`/groups/${group.slug}/lists`);

export const constructHeader = (dependencies: Dependencies, user: Params['user']) => (group: Group): ViewModel['header'] => ({
  group,
  isFollowing: pipe(
    user,
    O.fold(
      () => false,
      (u) => dependencies.isFollowing(group.id)(u.id),
    ),
  ),
  followerCount: pipe(
    dependencies.getFollowers(group.id),
    RA.size,
  ),
  groupAboutPageHref: `/groups/${group.slug}/about`,
  groupListsPageHref: constructGroupListsPageHref(group),
  groupFollowersPageHref: `/groups/${group.slug}/followers`,
});
