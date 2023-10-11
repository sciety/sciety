import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ViewModel } from './view-model';

export const listIdInputName = 'listId';
export const articleIdInputName = 'articleId';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
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
    <section>
      <label for="annotationContent" class="standard-form__sub_heading">Annotation content</label>
      <textarea id="annotationContent" name="content" rows="10"></textarea>
    </section>
    <button type="submit">Confirm</button>
  </form>
`);
