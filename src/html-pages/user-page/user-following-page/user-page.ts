import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, renderAsHtml } from './render-as-html';
import { HtmlPage } from '../../../types/html-page';
import { RenderPageError } from '../../../types/render-page-error';
import { constructViewModel, Params } from './construct-view-model';
import { Queries } from '../../../read-models';

type UserPage = (params: Params) => TE.TaskEither<RenderPageError, HtmlPage>;

export const userPage = (queries: Queries): UserPage => (params) => pipe(
  params,
  constructViewModel(queries),
  TE.bimap(renderErrorPage, renderAsHtml),
);
