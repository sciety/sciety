import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from './save-article-handler';

export const renderSaveMultipleListsForm = (doi: Doi, listName: string): HtmlFragment => toHtmlFragment(`
  <form method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <div class="list-name">${listName}</div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`);
