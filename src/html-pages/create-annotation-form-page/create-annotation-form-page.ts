import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage, toHtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { renderPage } from './render-page';
import { Dependencies, constructViewModel } from './construct-view-model';
import { toErrorPage } from './to-error-page';
import { UnrecoverableError } from './view-model';
import { Params } from './params';

type CreateAnnotationFormPage = (dependencies: Dependencies)
=> (params: Params, unrecoverableError?: UnrecoverableError)
=> TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (
  dependencies,
) => (
  params,
  unrecoverableError,
) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId, dependencies, unrecoverableError),
  TE.bimap(
    toErrorPage,
    (viewModel) => toHtmlPage({
      title: viewModel.pageHeading,
      content: renderPage(viewModel),
    }),
  ),
);
