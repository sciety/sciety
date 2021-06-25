import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { GetAllEvents, projectFollowedGroupIds } from './project-followed-group-ids';
import { renderFollowList } from './render-follow-list';
import { populateGroupViewModel } from '../../shared-components/group-card/populate-group-view-model';
import { renderGroupCard } from '../../shared-components/group-card/render-group-card';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { informationUnavailable } from '../static-messages';

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type Ports = {
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

type FollowList = (ports: Ports) => (userId: UserId, viewingUserId: O.Option<UserId>)
=> TE.TaskEither<never, HtmlFragment>;

export const followList: FollowList = (ports) => (userId) => pipe(
  userId,
  projectFollowedGroupIds(ports.getAllEvents),
  T.chain(TE.traverseArray(populateGroupViewModel(ports.getGroup, ports.getAllEvents))),
  TE.map(RA.map(renderGroupCard)),
  TE.match(
    () => informationUnavailable,
    renderFollowList,
  ),
  TE.rightTask,
);
