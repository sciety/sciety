import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderJotForm } from './render-jot-form';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">

    <h1>${viewModel.pageHeading}</h1>
  </header>

  <section>
    <p>
      By subscribing to <a href="${viewModel.listHref}">${viewModel.listName}</a>, you will receive a weekly email update when new articles are added to the list. You may unsubscribe at any time.
    </p>
  </section>
  ${renderJotForm(viewModel.listId)}
`);
