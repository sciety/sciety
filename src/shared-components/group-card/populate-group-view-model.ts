import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { GroupViewModel } from './render-group-card';
import { updateGroupMeta } from './update-group-meta';
import { DomainEvent } from '../../types/domain-events';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

export type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export const populateGroupViewModel = (
  getGroup: GetGroup,
  getAllEvents: GetAllEvents,
): (groupId: GroupId
  ) => TE.TaskEither<'not-found', GroupViewModel> => flow(
  getGroup,
  T.map(E.fromOption(() => 'not-found' as const)),
  TE.chainTaskK((group) => pipe(
    getAllEvents,
    T.map(RA.reduce({ reviewCount: 0, followerCount: 0 }, updateGroupMeta(group.id))),
    T.map((meta) => ({
      ...group,
      ...meta,
      description: pipe(group.shortDescription, toHtmlFragment, sanitise),
    })),
  )),
);
