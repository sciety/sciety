import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../types/html-page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { ViewModel } from './view-model';

const renderLists = (lists: ViewModel['userLists']) => pipe(
  lists,
  RA.map((list) => `
    <div>
      <input type="radio" id="list-id-${list.id}" name="listId" value="${list.id}" class="save-article-page-form__target"/>
      <label for="list-id-${list.id}">${list.name}</label>
    </div>
  `),
  (divs) => divs.join(''),
);

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <form class="save-article-page-form standard-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${viewModel.articleId.value}">
    <fieldset class="save-article-page-form__fieldset" aria-describedby="saveArticlePageFormHelperTextForLists">
      <legend class="save-article-page-form__legend">
      Which list do you want to save this article to?
      </legend>
      <p id="saveArticlePageFormHelperTextForLists" class="save-article-page-form__helper_text">Select one of your lists.</p>
      ${renderLists(viewModel.userLists)}
    </fieldset>
    <button type="submit" class="save-article-page-form__button">
      Save article
    </button>
  </form>
`),
});
