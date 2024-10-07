import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderSearchForm } from '../../shared-components/search-form';
import { ViewModel } from '../view-model';

const includeUnevaluatedPreprints = false;

const evaluatedOnly = !includeUnevaluatedPreprints;

export const renderPage = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header">
      <h1>${viewModel.pageHeading}</h1>
    </header>
    <section>
      ${renderSearchForm('', evaluatedOnly, includeUnevaluatedPreprints)}
    </section>
  `,
  toHtmlFragment,
);
