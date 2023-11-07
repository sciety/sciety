import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../types/html-page';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { renderPage } from './render-page';
import { Dependencies, constructViewModel } from './construct-view-model';
import { toErrorPage } from './to-error-page';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { listIdCodec } from '../../types/list-id';
import { externalInputFieldNames } from '../../standards';
import { UnrecoverableError } from './view-model';

export const paramsCodec = t.type({
  [externalInputFieldNames.articleId]: DoiFromString,
  [externalInputFieldNames.listId]: listIdCodec,
});

type Params = t.TypeOf<typeof paramsCodec>;

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
