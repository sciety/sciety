import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies, constructViewModel } from './construct-view-model';
import { Params } from './params';
import { renderPage } from './render-page';
import { toErrorPage } from './to-error-page';
import { UnrecoverableError } from './view-model';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { HtmlPage, toHtmlPage } from '../html-page';

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
