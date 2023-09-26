import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderPage } from './render-page';
import { ViewModel } from './view-model';

export const paramsCodec = t.type({
  articleId: t.string,
  listId: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

const constructViewModel = (params: Params): ViewModel => ({
  articleId: params.articleId,
  listId: params.listId,
});

type CreateAnnotationFormPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = (params) => pipe(
  params,
  constructViewModel,
  (viewModel) => ({
    title: 'Create an annotation',
    content: renderPage(viewModel),
  }),
  TE.right,
);
