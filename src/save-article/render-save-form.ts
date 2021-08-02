import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderSaveForm = (doi: Doi): HtmlFragment => toHtmlFragment(`
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="articleid" value="${doi.value}">
    <button type="submit" class="save-article-button">
      <img class="save-article-button__icon" src="/static/images/playlist_add-24px.svg" alt=""> Save to my list
    </button>
  </form>
`);
