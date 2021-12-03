import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroups } from './render-groups';
import { toListOfGroupCardViewModels, Ports as ViewModelPorts } from './to-list-of-group-card-view-models';
import { DomainEvent } from '../domain-events';
import { renderGroupCard } from '../shared-components/group-card/render-group-card';
import { getAllGroups } from '../shared-read-models/groups';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Ports = ViewModelPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const renderErrorPage = (error: DE.DataError): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

type GroupsPage = TE.TaskEither<RenderPageError, Page>;

export const groupsPage = (ports: Ports): GroupsPage => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.map(getAllGroups),
  TE.chain(toListOfGroupCardViewModels(ports)),
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
