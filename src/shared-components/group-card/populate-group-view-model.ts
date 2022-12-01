import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import { updateGroupMeta } from './update-group-meta';
import { GetAllEvents, GetGroup, SelectAllListsOwnedBy } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { sanitise } from '../../types/sanitised-html-fragment';

export type Ports = {
  getAllEvents: GetAllEvents,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  getGroup: GetGroup,
};

export const populateGroupViewModel = (
  ports: Ports,
) => (
  groupId: GroupId,
): TE.TaskEither<DE.DataError, GroupViewModel> => pipe(
  ports.getGroup(groupId),
  TE.fromEither,
  TE.chainTaskK((group) => pipe(
    ports.getAllEvents,
    T.map(RA.reduce({ evaluationCount: 0, followerCount: 0, latestActivity: O.none }, updateGroupMeta(group.id))),
    T.map((meta) => ({
      ...group,
      ...meta,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
  TE.map((partial) => pipe(
    groupId,
    LOID.fromGroupId,
    ports.selectAllListsOwnedBy,
    ((lists) => lists.length),
    ((listCount) => ({
      ...partial,
      listCount,
    })),
  )),
);
