import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructViewModel, Dependencies } from './construct-view-model/construct-view-model';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { Params } from './params';
import { renderErrorPage } from './render-as-html/render-error-page';

export const listsPage = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  E.map(renderAsHtml),
  E.mapLeft(renderErrorPage),
  TE.fromEither,
);
