import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { pathToSubmitRemoveListPromotion } from '../../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';
import { renderListItems } from '../../../shared-components/list-items';
import { CurrentlyFeaturedLists } from '../view-model';

const renderFeaturedList = (listWithUnfeatureAction: CurrentlyFeaturedLists[number]) => `
    ${listWithUnfeatureAction.listName}
    <form action="${pathToSubmitRemoveListPromotion()}" method="post">
      <input type="hidden" name="${inputFieldNames.listId}" value="${listWithUnfeatureAction.listId}" />
      <input type="hidden" name="${inputFieldNames.forGroup}" value="${listWithUnfeatureAction.forGroup}" />
      <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${listWithUnfeatureAction.successRedirectPath}" />
      <button type="submit">Unfeature</button>
    </form>
  `;

const renderForms = (viewModel: CurrentlyFeaturedLists) => pipe(
  viewModel,
  RA.map((renderFeaturedList)),
  RA.map(toHtmlFragment),
  (items) => renderListItems(items),
  (items) => `<ul class="list-names-with-actions">${items}</ul>`,
);

export const renderCurrentlyFeaturedLists = (viewModel: CurrentlyFeaturedLists): HtmlFragment => pipe(
  viewModel,
  RA.match(
    () => '<p>Currently no featured lists</p>',
    () => renderForms(viewModel),
  ),
  (content) => `<h3>Currently featured lists</h3>
      ${content}
    `,
  toHtmlFragment,
);
