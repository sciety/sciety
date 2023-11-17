import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroups } from './render-groups.js';
import { renderGroupCard } from '../../shared-components/group-card/index.js';
import * as DE from '../../types/data-error.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';
import { constructViewModel } from './construct-view-model/construct-view-model.js';
import { Queries } from '../../read-models/index.js';

const renderErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

type GroupsPage = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

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
