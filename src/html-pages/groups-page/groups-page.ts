import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroups } from './render-groups';
import { renderGroupCard } from '../../shared-components/group-card';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { Queries } from '../../read-models';

const renderErrorPage = (error: DE.DataError): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

type GroupsPage = TE.TaskEither<RenderPageError, Page>;

export const groupsPage = (queries: Queries): GroupsPage => pipe(
  constructViewModel(queries),
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
