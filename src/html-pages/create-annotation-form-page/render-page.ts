import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';

export const listIdInputName = 'listId';
export const articleIdInputName = 'articleId';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>Create an annotation for <span class="annotation-form-article-title">${viewModel.articleTitle}</span> on <span class="annotation-form-list-name">${htmlEscape(viewModel.listName)}</span></h1>
  </header>
  <form class="standard-form" method="POST" action="/annotations/create-annotation">
    <input type="hidden" name="${articleIdInputName}" value="${viewModel.articleId.value}">
    <input type="hidden" name="${listIdInputName}" value="${viewModel.listId}">
    <dl>
      <dt>Article</dt>
      <dd>${viewModel.articleTitle}</dd>
      <dt>List</dt>
      <dd>${viewModel.listName}</dd>
    </dl>
    <label for="annotationContent">Annotation content</label>
    <textarea id="annotationContent" name="annotationContent" rows="10"></textarea>
    <button type="submit">Create annotation</button>
  </form>
`);
