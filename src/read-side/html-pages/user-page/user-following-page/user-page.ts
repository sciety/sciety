import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params } from './construct-view-model';
import { renderErrorPage, renderAsHtml } from './render-as-html';
import { Queries } from '../../../../read-models';
import { ErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';
import { HtmlPage } from '../../html-page';

type UserPage = (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const userPage = (queries: Queries): UserPage => (params) => pipe(
  params,
  constructViewModel(queries),
  TE.bimap(renderErrorPage, renderAsHtml),
);
