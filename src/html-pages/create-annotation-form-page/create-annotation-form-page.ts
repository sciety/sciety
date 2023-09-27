import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderPage } from './render-page';
import { Dependencies, constructViewModel } from './construct-view-model';
import { toErrorPage } from './to-error-page';

export const paramsCodec = t.type({
  articleId: t.string,
  listId: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

type CreateAnnotationFormPage = (dependencies: Dependencies)
=> (params: Params)
=> TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (dependencies) => (params) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId, dependencies),
  TE.bimap(
    toErrorPage,
    (viewModel) => ({
      title: 'Create an annotation',
      content: renderPage(viewModel),
    }),
  ),
);
