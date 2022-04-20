import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const paramsCodec = t.type({
  articleId: t.union([t.string, t.undefined]),
});

type CreateAnnotationFormPage = (queryParams: { articleId?: string }) => TE.TaskEither<RenderPageError, Page>;

export const createAnnotationFormPage: CreateAnnotationFormPage = ({ articleId }) => TE.right({
  title: 'Create an annotation',
  content: toHtmlFragment(`
    <h1>Create an annotation for an article on <a href="https://sciety.org/users/AvasthiReading/lists/saved-articles">Prachee's list</a></h1>
    <form method="POST" action="/annotations/create-annotation">
      <label for="annotationContent">Annotation content</label>
      <textarea id="annotationContent" name="annotationContent" rows="10" class="annotation-form-content"></textarea>
      <label for="articleId">Article DOI</label>
      <input type="text" name="articleId" id="articleId" placeholder="10.1101/2022.04.01.486801" class="annotation-form-article-id" value="${articleId ?? ''}">
      <div class="annotation-form-controls">
        <button class="annotation-form-submit">Create annotation</button>
        <button type="reset" class="annotation-form-reset">Reset</button>
      </div>
    </form>
  `),
});
