import { htmlEscape } from 'escape-goat';
import { ViewModel } from '../view-model.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderJotForm } from './render-jot-form.js';

export const renderPage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">

    <h1>${viewModel.pageHeading}</h1>
  </header>

  <section>
    <p>
      By subscribing to <a href="${viewModel.listHref}">${htmlEscape(viewModel.listName)}</a>, you will receive a weekly email update when new articles are added to the list. You may unsubscribe at any time.
    </p>
  </section>
  ${renderJotForm(viewModel.listId)}
`);
