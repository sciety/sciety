import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { renderFollowList } from './render-follow-list';
import { populateGroupViewModel, Ports as PopulateGroupViewModelPorts } from '../../shared-components/group-card/populate-group-view-model';
import { renderGroupCard } from '../../shared-components/group-card/render-group-card';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { followingNothing, informationUnavailable } from '../static-messages';

export type Ports = PopulateGroupViewModelPorts;

type FollowList = (ports: Ports) => (groupIds: ReadonlyArray<GroupId>) => T.Task<HtmlFragment>;

export const followList: FollowList = (ports) => (groupIds) => pipe(
  groupIds,
  RNEA.fromReadonlyArray,
  TE.fromOption(() => followingNothing),
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
