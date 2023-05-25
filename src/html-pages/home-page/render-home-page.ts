import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderGroups } from './render-groups';
import { hero } from './hero';
import { ViewModel } from './view-model';
import { renderEvaluationCardsSection } from './cards/render-evaluation-cards-section';

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${hero}
    ${pipe(
    viewModel.groups,
    O.match(
      () => '',
      renderGroups,
    ),
  )}
    ${renderEvaluationCardsSection()}
  </div>
`);
