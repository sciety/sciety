import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { GroupId } from '../types/group-id';
import { Page } from '../types/page';
import { UserId } from '../types/user-id';

type Ports = {
  getAllGroups: GetAllGroups,
  follows: (u: UserId, g: GroupId) => T.Task<boolean>,
};

export const groupsPage = (ports: Ports) => (): TE.TaskEither<never, Page> => pipe(
  renderGroups(
    ports.getAllGroups,
    renderGroup(renderFollowToggle, ports.follows),
  )(O.none),
  T.map((content) => ({
    title: 'Groups',
    content,
    openGraph: {
      title: 'Groups',
      description: 'Groups',
    },
  })),
  TE.rightTask,
);
