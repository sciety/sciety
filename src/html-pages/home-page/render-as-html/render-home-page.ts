import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderCurationTeasers } from './render-curation-teasers';
import { renderGroups } from './render-groups';
import { renderHero } from './render-hero';
import { renderValueStatements } from './render-value-statements';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

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
