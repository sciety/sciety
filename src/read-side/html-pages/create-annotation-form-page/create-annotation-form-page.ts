import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies, constructViewModel } from './construct-view-model';
import { Params } from './params';
import { renderPage } from './render-page';
import { UnrecoverableError } from './view-model';
import { ErrorPageViewModel, constructErrorPageViewModel } from '../construct-error-page-view-model';
import { HtmlPage, toHtmlPage } from '../html-page';

type CreateAnnotationFormPage = (dependencies: Dependencies, unrecoverableError?: UnrecoverableError)
=> (params: Params)
=> TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (
  dependencies, unrecoverableError,
) => (
  params,
) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId, dependencies, unrecoverableError),
  TE.bimap(
    constructErrorPageViewModel,
    (viewModel) => toHtmlPage({
      title: viewModel.pageHeading,
      content: renderPage(viewModel),
    }),
  ),
);
