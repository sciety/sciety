import { pipe } from 'fp-ts/function';
import { articleIdFieldName } from './execute-unsave-article-command';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderUnsaveForm = (articleId: Doi): HtmlFragment => pipe(
  articleId.value,
  (id) => `<form method="post" action="/unsave-article">
      <input type="hidden" name="${articleIdFieldName}" value="${id}">
      <button aria-label="Remove this article from the list" class="saved-articles-control">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" class="saved-articles-control__icon">
          <desc>Remove this article from the list</desc>
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
        </svg>
      </button>
    </form>`,
  toHtmlFragment,
);
