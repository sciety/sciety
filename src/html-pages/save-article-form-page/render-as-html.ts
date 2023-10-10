import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlPage } from '../../types/html-page';
import { toHtmlFragment } from '../../types/html-fragment';
import { articleIdFieldName } from '../../write-side/save-article/save-article-handler';
import { ViewModel } from './view-model';

const renderListRadios = (lists: ViewModel['userLists']) => pipe(
  lists,
  RA.map((list) => `
    <div class="save-article-page-form__target_wrapper">
      <input type="radio" id="list-id-${list.id}" name="listId" value="${list.id}"/>
      <label for="list-id-${list.id}">${list.name}</label>
    </div>
  `),
  (divs) => divs.join(''),
);

const renderAddAnnotation = () => (process.env.EXPERIMENT_ENABLED === 'true' ? `
<section class="save-article-form-section">
  <label for="annotationContent" class="save-article-form-label">Why are you saving this article (optional)?</label>
  <textarea id="annotationContent" name="annotation"></textarea>
</section>
`
  : '');

const renderLists = (userLists: ViewModel['userLists'], articleName: ViewModel['article']['name']) => {
  if (userLists.length > 1) {
    return `
      <dl>
        <dt>Article</dt>
        <dd>${articleName}</dd>
      </dl>
      <fieldset aria-describedby="saveArticlePageFormHelperTextForLists">
      <legend>
        Which list do you want to save this article to?
      </legend>
      <p id="saveArticlePageFormHelperTextForLists" class="save-article-page-form__helper_text">Select one of your lists.</p>
        ${renderListRadios(userLists)}
      </fieldset>
    `;
  }
  const list = userLists[0];
  return `
  <input type="hidden" name="listId" value="${list.id}"/>
  <dl>
    <dt>Article</dt>
    <dd>${articleName}</dd>
    <dt>List</dt>
    <dd>${list.name}</dd>
  </dl>
  `;
};

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <form class="standard-form" method="post" action="/save-article">
    <input type="hidden" name="${articleIdFieldName}" value="${viewModel.articleId.value}">
    ${renderLists(viewModel.userLists, viewModel.article.name)}
    ${renderAddAnnotation()}
    <button type="submit">
      Save article
    </button>
  </form>
`),
});
