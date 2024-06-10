import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { pathToSubmitAddAFeaturedList } from '../../../../http/form-submission-handlers/submit-paths';
import { List } from '../../../../read-models/lists';
import { inputFieldNames } from '../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../shared-components/list-items';

const renderFormForAParticularList = (viewModel: ViewModel) => (list: List) => toHtmlFragment(`
  ${list.name}
  <form action="${pathToSubmitAddAFeaturedList()}" method="post" >
    <input type="hidden" name="${inputFieldNames.forGroup}" value="${viewModel.groupId}">
    <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${viewModel.successRedirectPath}">
    <input type="hidden" id="listId" name="${inputFieldNames.listId}" value="${list.id}">
    <button type="submit">Feature</button>
  </form>
`);

export const renderFeatureAList = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.listsThatCanBeFeatured,
  RA.map(renderFormForAParticularList(viewModel)),
  RA.match(
    () => '<p>No lists available for featuring.</p>',
    (items) => `<ul class="list-names-with-actions">${renderListItems(items, 'currently-featured-lists__item')}</ul>`,
  ),
  (forms) => toHtmlFragment(`
    <h2>Feature a list</h2>
    <p class="standard-form__sub_heading_secondary_text">Choose a list to feature on your group page.</p>
    ${forms}
  `),
);
