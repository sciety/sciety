import { renderCurrentlyFeaturedLists } from './render-currently-featured-lists';
import { renderListsThatCanBeFeatured } from './render-lists-that-can-be-featured';
import { toHtmlFragment } from '../../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
    <p>
      From here you can manage your public group pages on Sciety.
      You are able to see this page as you are a designated administrator for a Sciety group.
    </p>
    <p>
      <a href="${viewModel.groupHomePageHref}">View public group page</a>
    </p>
  </header>
  <section class="group-management-of-featured-lists">
    <h2>Featured lists</h2>
    <p>Featuring a list on your group home page lets you highlight your review and curation activity to readers.</p>
    <section class="group-management-of-featured-lists__sub-section">
      ${renderCurrentlyFeaturedLists(viewModel.currentlyFeaturedLists)}
    </section>
    <section class="group-management-of-featured-lists__sub-section">
      ${renderListsThatCanBeFeatured(viewModel.listsThatCanBeFeatured)}
    </section>
  </section>
  `),
});
