import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { GroupId } from '../types/group-id';
import { Page } from '../types/page';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  getAllGroups: GetAllGroups,
  follows: (u: UserId, g: GroupId) => T.Task<boolean>,
};

type Params = {
  user: O.Option<User>,
};

type GroupsPage = (params: Params) => TE.TaskEither<never, Page>;

export const groupsPage = (ports: Ports): GroupsPage => flow(
  (params) => params.user,
  O.map((user) => user.id),
  renderGroups(
    ports.getAllGroups,
    renderGroup(renderFollowToggle, ports.follows),
  ),
  T.map((content) => ({
    title: 'Groups',
    content,
    openGraph: {
      title: 'Sciety Groups',
      description: 'Content creators helping you decide which preprints to read and trust.',
    },
  })),
  TE.rightTask,
);
