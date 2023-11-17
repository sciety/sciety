import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderGroups } from './render-groups';
import { renderGroupCard } from '../../shared-components/group-card';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';

const renderErrorPage = (error: DE.DataError): ErrorPageBodyViewModel => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

type GroupsPage = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const groupsPage = (dependencies: Dependencies): GroupsPage => pipe(
  constructViewModel(dependencies),
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
