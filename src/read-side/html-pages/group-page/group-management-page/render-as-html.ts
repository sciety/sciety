import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderFeatureAList } from './render-feature-a-list';
import { ViewModel } from './view-model';
import {
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
    <input type="hidden" name="${inputFieldNames.listId}" value="${list.id}" />
    <input type="hidden" name="${inputFieldNames.forGroup}" value="${groupId}" />
    <input type="hidden" name="${inputFieldNames.successRedirectPath}" value="${successRedirectPath}" />
    <button type="submit">Unfeature</button>
  </form>
`;

const renderFeaturedLists = (viewModel: ViewModel) => pipe(
  viewModel.featuredLists,
  RA.map((renderFeaturedList(viewModel.successRedirectPath, viewModel.groupId))),
  RA.map(toHtmlFragment),
  (items) => renderListItems(items),
  (items) => `<ul class="list-names-with-actions">${items}</ul>`,
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
  <section class="group-management-section">
    <h2>Currently featured lists</h2>
   ${pipe(
    viewModel.featuredLists,
    RA.match(
      () => '<p>Currently no featured lists</p>',
      () => renderFeaturedLists(viewModel),
    ),
  )}
  </section>
  <section class="group-management-section">
    ${renderFeatureAList(viewModel)}
  </section>
  `),
});
