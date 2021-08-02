import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderUnsaveForm = (articleId: Doi): HtmlFragment => pipe(
  articleId.value,
  (id) => `<form method="post" action="/unsave-article">
      <input type="hidden" name="articleid" value="${id}">
      <button class="saved-articles-control">
        <img src="/static/images/delete.svg" alt="Remove this article from the list">
      </button>
    </form>`,
  toHtmlFragment,
);
