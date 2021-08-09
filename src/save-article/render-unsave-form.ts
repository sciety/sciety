import { pipe } from 'fp-ts/function';
import { encodedCommandFieldName } from './save-command';
import { CommandFromString } from '../types/command';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderUnsaveForm = (articleId: Doi): HtmlFragment => pipe(
  `<form method="post" action="/command">
    <input type="hidden" name="${encodedCommandFieldName}" value="${CommandFromString.encode({ articleId, type: 'UnsaveArticle' })}">
    <button class="saved-articles-control">
      <img src="/static/images/delete.svg" alt="Remove this article from the list">
    </button>
  </form>`,
  toHtmlFragment,
);
