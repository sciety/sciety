import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import { updateGroupMeta } from './update-group-meta';
import * as DE from '../../types/data-error';
import { DomainEvent } from '../../types/domain-events';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
};

export const populateGroupViewModel = (
  ports: Ports,
) => (
  groupId: GroupId,
): TE.TaskEither<DE.DataError, GroupViewModel> => pipe(
  groupId,
  ports.getGroup,
  T.map(E.fromOption(() => DE.notFound)),
  TE.chainTaskK((group) => pipe(
    ports.getAllEvents,
    T.map(RA.reduce({ reviewCount: 0, followerCount: 0, latestActivityDate: O.none }, updateGroupMeta(group.id))),
    T.map((meta) => ({
      ...group,
      ...meta,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
);
