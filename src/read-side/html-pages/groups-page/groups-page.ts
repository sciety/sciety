import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { renderGroups } from './render-groups';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage, NotHtml, toHtmlPage } from '../html-page';
import { renderGroupCard } from '../shared-components/group-card';

type GroupsPage = TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const groupsPage = (dependencies: Dependencies): GroupsPage => pipe(
  constructViewModel(dependencies),
  TE.map(RA.map(renderGroupCard)),
  TE.map(renderGroups),
  TE.bimap(
    constructErrorPageViewModel,
    (content) => toHtmlPage({
      title: 'Groups',
      content,
      openGraph: {
        title: 'Sciety Groups',
        description: 'Content creators helping you decide which preprints to read and trust.' as NotHtml,
      },
    }),
  ),
);
