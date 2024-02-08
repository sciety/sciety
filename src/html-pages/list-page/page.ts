import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { renderErrorPage } from './render-as-html/render-error-page';
import { renderAsHtml } from './render-as-html/render-as-html';
import { constructViewModel, Params, Dependencies } from './construct-view-model';

export const page = (
  dependencies: Dependencies,
) => (
  params: Params,
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
