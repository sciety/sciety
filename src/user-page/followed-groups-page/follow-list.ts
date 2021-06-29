import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { followedGroupIds, GetAllEvents } from './project-followed-group-ids';
import { renderFollowList } from './render-follow-list';
import { populateGroupViewModel, Ports as PopulateGroupViewModelPorts } from '../../shared-components/group-card/populate-group-view-model';
import { renderGroupCard } from '../../shared-components/group-card/render-group-card';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { followingNothing, informationUnavailable } from '../static-messages';

type FollowedGroupIdsPorts = {
  getAllEvents: GetAllEvents,
};

export type Ports = PopulateGroupViewModelPorts & FollowedGroupIdsPorts;

type FollowList = (ports: Ports) => (userId: UserId)
=> T.Task<HtmlFragment>;

export const followList: FollowList = (ports) => (userId) => pipe(
  userId,
  TE.right,
  TE.chain(flow(
    followedGroupIds(ports.getAllEvents),
    T.map(RNEA.fromReadonlyArray),
    T.map(E.fromOption(() => followingNothing)),
  )),
  TE.chain(flow(
    TE.traverseArray(populateGroupViewModel(ports)),
    TE.mapLeft(() => informationUnavailable),
  )),
  TE.map(flow(
    RA.map(renderGroupCard),
    renderFollowList,
  )),
  TE.toUnion,
);
