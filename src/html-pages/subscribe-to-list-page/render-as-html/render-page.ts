import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderJotForm } from './render-jot-form';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">

    <h1>${viewModel.pageHeading}</h1>
  </header>

  <section>
    <p>
      Here you can subscribe to <a href="${viewModel.listHref}">${viewModel.listName}</a>.
    </p>
  </section>
  ${renderJotForm(viewModel.listId)}
`);
