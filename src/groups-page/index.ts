import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroup } from './render-group';
import { GetAllGroups, renderGroups } from './render-groups';
import { Page } from '../types/page';

type Ports = {
  getAllGroups: GetAllGroups,
};

type GroupsPage = TE.TaskEither<never, Page>;

export const groupsPage = (ports: Ports): GroupsPage => pipe(
  renderGroups(
    ports.getAllGroups,
    renderGroup,
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
