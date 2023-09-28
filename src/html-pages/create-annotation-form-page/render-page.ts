import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';

export const listIdInputName = 'listId';
export const articleIdInputName = 'articleId';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
    <h1>Create an annotation</h1>
    <p>Create an annotation for <a href="/articles/${viewModel.articleId.value}" class="annotation-form-article-title">${viewModel.articleTitle}</a> on <a href="/lists/${viewModel.listId}" class="annotation-form-list-name">${viewModel.listName}</a></p>
    <form method="POST" action="/annotations/create-annotation">
      <label for="annotationContent">Annotation content</label>
      <textarea id="annotationContent" name="annotationContent" rows="10" class="annotation-form-content"></textarea>
      <input type="hidden" name="${listIdInputName}" value="${viewModel.listId}">
      <input type="hidden" name="${articleIdInputName}" value="${viewModel.articleId.value}">
      <div class="annotation-form-controls">
        <button class="annotation-form-submit">Create annotation</button>
        <button type="reset" class="annotation-form-reset">Reset</button>
      </div>
    </form>
  `);
