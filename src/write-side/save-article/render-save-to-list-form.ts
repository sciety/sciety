import { ArticleId } from '../../types/article-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { articleIdFieldName } from './save-article-handler';

export const renderSaveToListForm = (doi: ArticleId, listId: ListId, listName: string): HtmlFragment => toHtmlFragment(`
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <input type="hidden" name="listId" value="${listId}">
    <div class="list-name">${listName}</div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`);
