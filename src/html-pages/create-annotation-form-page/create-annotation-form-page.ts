import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderPage } from './render-page';
import { constructViewModel } from './construct-view-model';

export const paramsCodec = t.type({
  articleId: t.string,
  listId: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

type CreateAnnotationFormPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (params) => pipe(
  params,
  ({ articleId, listId }) => constructViewModel(articleId, listId),
  (viewModel) => ({
    title: 'Create an annotation',
    content: renderPage(viewModel),
  }),
  TE.right,
);
