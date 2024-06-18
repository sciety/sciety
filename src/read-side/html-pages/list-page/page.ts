import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Params, Dependencies } from './construct-view-model';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

export const page = (
  dependencies: Dependencies,
) => (
  params: Params,
): TE.TaskEither<ErrorPageViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
