import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import {
  GetAllEvents, GetFollowers, GetGroup, SelectAllListsOwnedBy,
} from '../../shared-ports';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Queries } from '../../shared-read-models';

export type Ports = Queries & {
  getAllEvents: GetAllEvents,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getFollowers: GetFollowers,
  getGroup: GetGroup,
};

export const populateGroupViewModel = (
  ports: Ports,
) => (
  groupId: GroupId,
): TE.TaskEither<DE.DataError, GroupViewModel> => pipe(
  ports.getGroup(groupId),
  TE.fromOption(() => DE.notFound),
  TE.chainOptionK(() => DE.notFound)((group) => pipe(
    group.id,
    ports.getActivityForGroup,
    O.map((meta) => ({
      ...group,
      ...meta,
      latestActivity: meta.latestActivityAt,
      followerCount: ports.getFollowers(group.id).length,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
  TE.map((partial) => pipe(
    groupId,
    LOID.fromGroupId,
    ports.selectAllListsOwnedBy,
    RA.size,
    ((listCount) => ({
      ...partial,
      listCount,
    })),
  )),
);
