import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { ViewModel } from './view-model';

const renderLists = (listNames: ViewModel['userListNames']) => pipe(
  listNames,
  RA.map((listName) => `
    <div>
      <input type="radio" id="${listName}" name="drone" value="fake-list-id" />
      <label for="${listName}">${listName}</label>
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
      ${renderLists(viewModel.userListNames)}
    </div>
    <button type="submit" class="save-article-button">
      Save article
    </button>
  </form>
`),
});
