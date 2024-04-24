import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { renderAsHtml } from './render-as-html';
import { renderErrorPage } from './render-error-page';
import { HtmlPage } from '../../../../html-pages/html-page';
import { ErrorPageBodyViewModel } from '../../../../types/error-page-body-view-model';

export const page = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params.slug,
  constructViewModel(dependencies),
  E.bimap(
    renderErrorPage,
    renderAsHtml,
  ),
  TE.fromEither,
);
