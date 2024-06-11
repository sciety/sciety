import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { pathToSubmitAddAFeaturedList } from '../../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderListItems } from '../../../shared-components/list-items';
import { ListsThatCanBeFeatured, ListThatCanBeFeatured } from '../view-model';

const renderFormForAParticularList = (viewModel: ListThatCanBeFeatured) => toHtmlFragment(`
  ${viewModel.listName}
  <form action="${pathToSubmitAddAFeaturedList()}" method="post" >
    <input type="hidden" name="${inputFieldNames.forGroup}" value="${viewModel.forGroup}">
    <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${viewModel.successRedirectPath}">
    <input type="hidden" id="listId" name="${inputFieldNames.listId}" value="${viewModel.listId}">
    <button type="submit">Feature</button>
  </form>
`);

export const renderListsThatCanBeFeatured = (viewModel: ListsThatCanBeFeatured): HtmlFragment => pipe(
  viewModel,
  RA.map(renderFormForAParticularList),
  RA.match(
    () => '<p>No lists available for featuring.</p>',
    (items) => `<ul class="list-names-with-actions">${renderListItems(items)}</ul>`,
  ),
  (forms) => toHtmlFragment(`
    <h2>Feature a list</h2>
    <p class="standard-form__sub_heading_secondary_text">Choose a list to feature on your group page.</p>
    ${forms}
  `),
);
