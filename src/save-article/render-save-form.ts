import { encodedCommandFieldName } from './save-save-article-command';
import { CommandFromString } from '../types/command';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderSaveForm = (doi: Doi): HtmlFragment => toHtmlFragment(`
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${encodedCommandFieldName}" value="${CommandFromString.encode({ articleId: doi, type: 'SaveArticle' })}">
    <button type="submit" class="save-article-button">
      <img class="save-article-button__icon" src="/static/images/playlist_add-24px.svg" alt=""> Save to my list
    </button>
  </form>
`);
