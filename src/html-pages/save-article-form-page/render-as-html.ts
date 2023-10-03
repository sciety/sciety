import { Page } from '../../types/page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { Doi } from '../../types/doi';

const listName = 'My test list';
const listId = 'fake-list-id';
const doi = new Doi('10.1101/123456');

export const renderAsHtml = (): Page => ({
  title: 'Save article page',
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>Save article</h1>
  </header>
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <input type="hidden" name="listId" value="${listId}">
    <div class="list-name">${listName}</div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`),
});
