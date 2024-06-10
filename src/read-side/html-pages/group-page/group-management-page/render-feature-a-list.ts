import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { pathToSubmitAddAFeaturedList } from '../../../../http/form-submission-handlers/submit-paths';
import { List } from '../../../../read-models/lists';
import { inputFieldNames } from '../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderFormForAParticularList = (viewModel: ViewModel) => (list: List) => `
<form action="${pathToSubmitAddAFeaturedList()}" method="post" >
  <input type="hidden" name="${inputFieldNames.forGroup}" value="${viewModel.groupId}">
  <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${viewModel.successRedirectPath}">
  <p>${list.name}</p>
  <input type="hidden" id="listId" name="${inputFieldNames.listId}" value="${list.id}">
  <button type="submit">Save</button>
</form>
`;

export const renderFeatureAList = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.listsThatCanBeFeatured,
  RA.map(renderFormForAParticularList(viewModel)),
  RA.match(
    () => '<p>No lists available for featuring.</p>',
    (items) => items.join('\n'),
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
