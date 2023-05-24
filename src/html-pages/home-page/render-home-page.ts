import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderCardsSection, renderEvaluationCardsSection } from './cards/render-cards-section';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { renderGroups } from './render-groups';
import { hero } from './hero';
import { ViewModel } from './view-model';

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
    ${process.env.EXPERIMENT_ENABLED === 'true' ? renderEvaluationCardsSection() : renderCardsSection()}
  </div>
`);
