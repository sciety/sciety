import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from './save-article-handler';

export const renderSaveMultipleListsForm = (doi: Doi): HtmlFragment => toHtmlFragment(`
  <form method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <button type="submit" class="save-article-button">
      <img class="save-article-button__icon" src="/static/images/playlist_add-24px.svg" alt=""> Save to my list
    </button>
  </form>
`);
