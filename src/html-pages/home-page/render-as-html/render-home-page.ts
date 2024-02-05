import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderGroups } from './render-groups';
import { renderHero } from './render-hero';
import { ViewModel } from '../view-model';
import { renderCurationTeasers } from './render-curation-teasers';
import { renderValueStatements } from './render-value-statements';

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${renderHero(viewModel)}
    ${renderValueStatements}
    ${pipe(
    viewModel.groups,
    O.match(
      () => '',
      renderGroups,
    ),
  )}
    ${renderCurationTeasers(viewModel)}
  </div>
`);
