import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Dependencies, Params } from './construct-view-model';
import { renderAsHtml, renderErrorPage } from './render-as-html';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { HtmlPage } from '../../html-page';

type GroupPage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);