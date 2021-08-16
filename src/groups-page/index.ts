import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroup } from './render-group';
import { renderGroups } from './render-groups';
import { Group } from '../types/group';
import { Page } from '../types/page';

type Ports = {
  getAllGroups: T.Task<RNEA.ReadonlyNonEmptyArray<Group>>,
};

type GroupsPage = TE.TaskEither<never, Page>;

export const groupsPage = (ports: Ports): GroupsPage => pipe(
  ports.getAllGroups,
  T.map(RNEA.map(renderGroup)),
  T.map(renderGroups),
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
