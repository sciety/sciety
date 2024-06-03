import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import {
  pathToSubmitAddAFeaturedList,
  pathToSubmitRemoveListPromotion,
} from '../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../standards';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { renderListItems } from '../../shared-components/list-items';

const renderFeaturedList = (
  successRedirectPath: ViewModel['successRedirectPath'],
  groupId: ViewModel['groupId'],
) => (list: ViewModel['featuredLists'][number]) => `
  ${list.name}
  <form action="${pathToSubmitRemoveListPromotion()}" method="post">
    <input type="hidden" name="listId" value="${list.id}" />
    <input type="hidden" name="forGroup" value="${groupId}" />
    <input type="hidden" name="successRedirectPath" value="${successRedirectPath}" />
    <button type="submit">Unfeature</button>
  </form>
`;

const renderFeaturedLists = (viewModel: ViewModel) => pipe(
  viewModel.featuredLists,
  RA.map((renderFeaturedList(viewModel.successRedirectPath, viewModel.groupId))),
  RA.map(toHtmlFragment),
  renderListItems,
  (items) => `<ul class="group-management__featured_list">${items}</ul>`,
);

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <p>
    From here you can manage your group pages on Sciety.
    You are able to see this page as you are a designated representative for a Sciety group.
  </p>
  <p>
    <a href="${viewModel.groupHomePageHref}">View public group page</a>
  </p>
  <section>
    <h2>Currently featured lists</h2>
   ${renderFeaturedLists(viewModel)}
  </section>
  <form action="${pathToSubmitAddAFeaturedList()}" method="post" class="standard-form">
    <h2>Feature a list</h2>
    <p class="standard-form__sub_heading_secondary_text">Choose a list to feature on your group page.</p>
      <section>
        <input type="hidden" name="forGroup" value="${viewModel.groupId}">
        <input type="hidden" name="successRedirectPath" value="${viewModel.successRedirectPath}">
        <label for="listId" class="standard-form__sub_heading">List Id</label>
        <input type="text" id="listId" name="${inputFieldNames.listId}" class="standard-form__full_width_text_input" value="">
      </section>
      <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
  </form>
  `),
});
