import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { pathToSubmitAddAFeaturedList } from '../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

export const renderFeatureAList = (viewModel: ViewModel): HtmlFragment => pipe(
  [],
  RA.match(
    () => '<p>No lists available for featuring.</p>',
    () => toHtmlFragment(`
      <form action="${pathToSubmitAddAFeaturedList()}" method="post" class="standard-form">
        <section>
            <input type="hidden" name="${inputFieldNames.forGroup}" value="${viewModel.groupId}">
            <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${viewModel.successRedirectPath}">
            <p class="standard-form__sub_heading">List Name</p>
            <input type="hidden" id="listId" name="${inputFieldNames.listId}" class="standard-form__full_width_text_input" value="">
          </section>
          <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
      </form>
    `),
  ),
  (forms) => toHtmlFragment(`
    <h2>Feature a list</h2>
    <p class="standard-form__sub_heading_secondary_text">Choose a list to feature on your group page.</p>
    ${forms}
    <form action="${pathToSubmitAddAFeaturedList()}" method="post" class="standard-form">
      <section>
          <input type="hidden" name="${inputFieldNames.forGroup}" value="${viewModel.groupId}">
          <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${viewModel.successRedirectPath}">
          <label for="listId" class="standard-form__sub_heading">List Id</label>
          <input type="text" id="listId" name="${inputFieldNames.listId}" class="standard-form__full_width_text_input" value="">
        </section>
        <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
    </form>
  `),
);
