import { pipe } from 'fp-ts/function';
import { commandCodec } from './command-handler';
import { articleIdFieldName, encodedCommandFieldName } from './save-save-article-command';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const saveCommand = (articleId: Doi): string => pipe(
  {
    articleId,
    type: 'SaveArticle',
  },
  commandCodec.encode,
  JSON.stringify,
);

export const renderSaveForm = (doi: Doi): HtmlFragment => toHtmlFragment(`
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${doi.value}">
    <input type="hidden" name="${encodedCommandFieldName}" value="${saveCommand(doi)}">
    <button type="submit" class="save-article-button">
      <img class="save-article-button__icon" src="/static/images/playlist_add-24px.svg" alt=""> Save to my list
    </button>
  </form>
`);
