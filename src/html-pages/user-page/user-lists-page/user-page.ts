import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderErrorPage, renderAsHtml } from './render-as-html/index.js';
import { HtmlPage } from '../../html-page.js';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model.js';
import { constructViewModel, Params } from './construct-view-model/index.js';
import { Queries } from '../../../read-models/index.js';

type UserPage = (params: Params) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const userPage = (queries: Queries): UserPage => (params) => pipe(
  params,
  constructViewModel(queries),
  TE.bimap(renderErrorPage, renderAsHtml),
);
