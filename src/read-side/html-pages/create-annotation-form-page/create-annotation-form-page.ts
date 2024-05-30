import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies, constructViewModel } from './construct-view-model';
import { Params } from './params';
import { renderPage } from './render-page';
import { UnrecoverableError } from './view-model';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { HtmlPage, toHtmlPage } from '../html-page';
import { renderErrorPage } from '../render-error-page';

type CreateAnnotationFormPage = (dependencies: Dependencies, unrecoverableError?: UnrecoverableError)
=> (params: Params)
=> TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (
  dependencies, unrecoverableError,
) => (
  params,
) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId, dependencies, unrecoverableError),
  TE.bimap(
    renderErrorPage,
    (viewModel) => toHtmlPage({
      title: viewModel.pageHeading,
      content: renderPage(viewModel),
    }),
  ),
);
