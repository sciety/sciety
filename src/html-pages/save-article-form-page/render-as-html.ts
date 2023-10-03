import { Page } from '../../types/page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { ViewModel } from './view-model';
import { renderListItems } from '../../shared-components/render-list-items';

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Save article page',
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>Save article</h1>
  </header>
  <p>
    ${viewModel.articleTitle}
  </p>
  <ul>
    ${renderListItems(viewModel.userListNames)}
  </ul>
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${viewModel.articleId.value}">
    <input type="hidden" name="listId" value="${viewModel.listId}">
    <div class="list-name">${viewModel.listName}</div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`),
});
