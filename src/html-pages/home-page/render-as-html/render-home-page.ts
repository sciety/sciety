import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderGroups } from './render-groups';
import { renderHero } from './render-hero';
import { ViewModel } from '../view-model';
import { renderEvaluationCardsSection } from './render-evaluation-cards-section';

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${renderHero}
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
