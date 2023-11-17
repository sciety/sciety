import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';
import { renderPage } from './render-page.js';
import { Dependencies, constructViewModel } from './construct-view-model.js';
import { toErrorPage } from './to-error-page.js';
import { UnrecoverableError } from './view-model.js';
import { Params } from './params.js';

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
    (viewModel) => ({
      title: viewModel.pageHeading,
      content: renderPage(viewModel),
    }),
  ),
);
