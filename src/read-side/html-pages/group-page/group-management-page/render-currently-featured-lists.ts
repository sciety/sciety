import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import {
  pathToSubmitRemoveListPromotion,
} from '../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../standards';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListItems } from '../../shared-components/list-items';

const renderFeaturedList = (
  successRedirectPath: ViewModel['successRedirectPath'],
  groupId: ViewModel['groupId'],
) => (list: ViewModel['featuredLists'][number]) => `
    ${list.name}
    <form action="${pathToSubmitRemoveListPromotion()}" method="post">
      <input type="hidden" name="${inputFieldNames.listId}" value="${list.id}" />
      <input type="hidden" name="${inputFieldNames.forGroup}" value="${groupId}" />
      <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${successRedirectPath}" />
      <button type="submit">Unfeature</button>
    </form>
  `;

const renderForms = (viewModel: ViewModel) => pipe(
  viewModel.featuredLists,
  RA.map((renderFeaturedList(viewModel.successRedirectPath, viewModel.groupId))),
  RA.map(toHtmlFragment),
  (items) => renderListItems(items),
  (items) => `<ul class="list-names-with-actions">${items}</ul>`,
);

export const renderCurrentlyFeaturedLists = (viewModel: ViewModel): HtmlFragment => pipe(
  viewModel.featuredLists,
  RA.match(
    () => '<p>Currently no featured lists</p>',
    () => renderForms(viewModel),
  ),
  (content) => `<h2>Currently featured lists</h2>
      ${content}
    `,
  toHtmlFragment,
);
