import { htmlEscape } from 'escape-goat';
import { renderCategoryContent } from './render-category-content';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';
import { ViewModel } from '../view-model';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(
    `
    <header class="page-header">
      <h1>${htmlEscape(viewModel.pageHeading)}</h1>
    </header>
    <section>
      ${renderCategoryContent(viewModel.categoryContent)}
    </section>
  `,
  ),
});
