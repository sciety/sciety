import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const paramsCodec = t.type({
  articleId: t.string,
  listId: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

export const listIdInputName = 'listId';

type CreateAnnotationFormPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = ({ articleId, listId }) => TE.right({
  title: 'Create an annotation',
  content: toHtmlFragment(`
    <h1>Create an annotation for an article on a list</h1>
    <form method="POST" action="/annotations/create-annotation">
      <label for="annotationContent">Annotation content</label>
      <textarea id="annotationContent" name="annotationContent" rows="10" class="annotation-form-content"></textarea>
      <input type="hidden" name="${listIdInputName}" value="${listId}">
      <input type="hidden" name="articleId" value="${articleId}">
      <div class="annotation-form-controls">
        <button class="annotation-form-submit">Create annotation</button>
        <button type="reset" class="annotation-form-reset">Reset</button>
      </div>
    </form>
  `),
});
