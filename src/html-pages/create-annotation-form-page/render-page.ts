import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const listIdInputName = 'listId';
export const articleIdInputName = 'articleId';

export type ViewModel = {
  articleId: string,
  listId: string,
};

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
    <h1>Create an annotation for an article on a list</h1>
    <form method="POST" action="/annotations/create-annotation">
      <label for="annotationContent">Annotation content</label>
      <textarea id="annotationContent" name="annotationContent" rows="10" class="annotation-form-content"></textarea>
      <input type="hidden" name="${listIdInputName}" value="${viewModel.listId}">
      <input type="hidden" name="${articleIdInputName}" value="${viewModel.articleId}">
      <div class="annotation-form-controls">
        <button class="annotation-form-submit">Create annotation</button>
        <button type="reset" class="annotation-form-reset">Reset</button>
      </div>
    </form>
  `);
