import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ViewModel, constructViewModel } from './construct-view-model/construct-view-model';
import { Dependencies } from './construct-view-model/dependencies';
import { renderAsHtml } from './render-as-html';
import { renderPage } from './render-page';
import * as DE from '../../../types/data-error';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { toUnavailable } from '../create-page-from-params';
import { HtmlPage } from '../html-page';
import { renderGroupCard } from '../shared-components/group-card';

type GroupsPage = TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

const renderGroupCards = (groupCards: TE.TaskEither<DE.DataError, ViewModel['groupCards']>) => pipe(
  groupCards,
  TE.map(RA.map(renderGroupCard)),
);

export const constructAndRenderPage = (dependencies: Dependencies): GroupsPage => pipe(
  constructViewModel(dependencies),
  TE.map((viewModel) => viewModel.groupCards),
  renderGroupCards,
  TE.map(renderPage),
  TE.bimap(toUnavailable, renderAsHtml),
);
