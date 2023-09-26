import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderPage } from './render-page';

export const paramsCodec = t.type({
  articleId: t.string,
  listId: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

type CreateAnnotationFormPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = ({ articleId, listId }) => TE.right({
  title: 'Create an annotation',
  content: renderPage({ articleId, listId }),
});
