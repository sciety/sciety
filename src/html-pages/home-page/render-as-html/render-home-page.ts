import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderGroups } from './render-groups.js';
import { renderHero } from './render-hero.js';
import { ViewModel } from '../view-model.js';
import { renderCurationTeasers } from './render-curation-teasers.js';
import { renderValueStatements } from './render-value-statements.js';

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
