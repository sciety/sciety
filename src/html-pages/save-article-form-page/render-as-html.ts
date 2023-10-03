import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { ViewModel } from './view-model';

const renderLists = (lists: ViewModel['userLists']) => pipe(
  lists,
  RA.map((list) => `
    <div>
      <input type="radio" id="list-id-${list.id}" name="listId" value="${list.id}" />
      <label for="list-id-${list.id}">${list.name}</label>
    </div>
  `),
  (divs) => divs.join(''),
);

export const renderAsHtml = (viewModel: ViewModel): Page => ({
  title: 'Save article page',
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>Save article</h1>
  </header>
  <p>
    ${viewModel.articleTitle}
  </p>
  <form class="save-article-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${viewModel.articleId.value}">
    <div>
      ${renderLists(viewModel.userLists)}
    </div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`),
});
