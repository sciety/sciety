import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Dependencies } from './construct-view-model/construct-view-model';
import { Params } from './params';
import { renderAsHtml } from './render-as-html/render-as-html';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage } from '../html-page';

export const listsPage = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<ErrorPageViewModel, HtmlPage> => pipe(
  params,
  constructViewModel(dependencies),
  E.map(renderAsHtml),
  E.mapLeft(constructErrorPageViewModel),
  TE.fromEither,
);
