import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Dependencies, Params } from './construct-view-model';
import { renderAsHtml } from './render-as-html';
import { constructErrorPageViewModel, ErrorPageViewModel } from '../../construct-error-page-view-model';
import { HtmlPage } from '../../html-page';

type GroupPage = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const constructAndRenderPage: GroupPage = (dependencies) => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
