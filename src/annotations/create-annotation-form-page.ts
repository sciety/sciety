import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const paramsCodec = t.type({
  articleId: tt.optionFromNullable(t.string),
  listId: tt.optionFromNullable(t.string),
});

const renderArticleIdInput = (articleId: O.Option<string>) => pipe(
  articleId,
  O.fold(
    () => '',
    (id) => id,
  ),
  (value) => `<input type="hidden" name="articleId" value="${value}">
`,
);

export const listIdInputName = 'listId';

const renderListIdInput = (listId: O.Option<string>) => pipe(
  listId,
  O.fold(
    () => '',
    (id) => id,
  ),
  (value) => `<input type="hidden" name="${listIdInputName}" value="${value}">
`,
);

type CreateAnnotationFormPage = (
  params: { articleId: O.Option<string>, listId: O.Option<string> }
) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = ({ articleId, listId }) => TE.right({
  title: 'Create an annotation',
  content: toHtmlFragment(`
    <h1>Create an annotation for an article on a list</h1>
    <form method="POST" action="/annotations/create-annotation">
      <label for="annotationContent">Annotation content</label>
      <textarea id="annotationContent" name="annotationContent" rows="10" class="annotation-form-content"></textarea>
      ${renderListIdInput(listId)}
      ${renderArticleIdInput(articleId)}
      <div class="annotation-form-controls">
        <button class="annotation-form-submit">Create annotation</button>
        <button type="reset" class="annotation-form-reset">Reset</button>
      </div>
    </form>
  `),
});
