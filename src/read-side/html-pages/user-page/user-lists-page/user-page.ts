import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params } from './construct-view-model';
import { renderAsHtml } from './render-as-html';
import { Queries } from '../../../../read-models';
import { constructErrorPageViewModel, ErrorPageViewModel } from '../../construct-error-page-view-model';
import { HtmlPage } from '../../html-page';

type UserPage = (params: Params) => TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const userPage = (queries: Queries): UserPage => (params) => pipe(
  params,
  constructViewModel(queries),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
