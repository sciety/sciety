import { htmlEscape } from 'escape-goat';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { pathToSubmitSaveArticle } from '../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../standards/input-field-names';
import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

const renderListRadios = (lists: ViewModel['userLists']) => pipe(
  lists,
  RA.map((list) => `
    <div class="standard-form__labelled_selectable_control">
      <input type="radio" id="list-id-${list.id}" name="listId" value="${list.id}" required/>
      <label for="list-id-${list.id}">${htmlEscape(list.name)}</label>
    </div>
  `),
  (divs) => divs.join(''),
);

const renderDependingOnUserListCount = (userLists: ViewModel['userLists'], articleName: ViewModel['article']['name']) => {
  if (userLists.length === 1) {
    const list = userLists[0];
    return `
      <dl>
        <dt>Article</dt>
        <dd>${articleName}</dd>
        <dt>List</dt>
        <dd>${htmlEscape(list.name)}</dd>
      </dl>
      <input type="hidden" name="listId" value="${list.id}"/>
  `;
  }
  return `
    <dl>
      <dt>Article</dt>
      <dd>${articleName}</dd>
    </dl>
    <fieldset aria-describedby="saveArticlePageFormHelperTextForLists">
    <legend class="standard-form__sub_heading">
      Which list do you want to save this article to?
    </legend>
    <p id="saveArticlePageFormHelperTextForLists" class="standard-form__helper_text">Select one of your lists.</p>
      ${renderListRadios(userLists)}
    </fieldset>
  `;
};

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <form class="standard-form" method="post" action="${pathToSubmitSaveArticle()}">
    <input type="hidden" name="${inputFieldNames.expressionDoi}" value="${viewModel.article.id.value}">
    ${renderDependingOnUserListCount(viewModel.userLists, viewModel.article.name)}
    <section>
      <label for="annotationContent" class="standard-form__sub_heading">Why are you saving this article? <span class="standard-form__sub_heading_secondary_text">(optional)</span></label>
      <p class="standard-form__helper_text">Add a public comment to share with others what's interesting or important about this article.</p>
      <textarea id="annotationContent" name="annotation" rows="10"></textarea>
    </section>
    <button type="submit">
      Confirm
    </button>
  </form>
`),
});
