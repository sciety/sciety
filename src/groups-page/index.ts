import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroups } from './render-groups';
import { populateGroupViewModel, Ports as ViewModelPorts } from '../shared-components/group-card/populate-group-view-model';
import { renderGroupCard } from '../shared-components/group-card/render-group-card';
import * as DE from '../types/data-error';
import { Group } from '../types/group';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Ports = ViewModelPorts & {
  getAllGroups: T.Task<RNEA.ReadonlyNonEmptyArray<Group>>,
};

const renderErrorPage = (error: DE.DataError): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

type GroupsPage = TE.TaskEither<RenderPageError, Page>;

export const groupsPage = (ports: Ports): GroupsPage => pipe(
  ports.getAllGroups,
  T.map(RNEA.map((group) => group.id)),
  TE.rightTask,
  TE.chain(TE.traverseArray(populateGroupViewModel(ports))),
  TE.map(RA.map(renderGroupCard)),
  TE.map(renderGroups),
  TE.bimap(
    renderErrorPage,
    (content) => ({
      title: 'Groups',
      content,
      openGraph: {
        title: 'Sciety Groups',
        description: 'Content creators helping you decide which preprints to read and trust.',
      },
    }),
  ),
);
