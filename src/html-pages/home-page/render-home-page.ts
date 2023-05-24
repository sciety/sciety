import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderCardsSection } from './cards/render-cards-section';
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
    ${process.env.EXPERIMENT_ENABLED === 'true' ? renderEvaluationCardsSection() : renderCardsSection()}
  </div>
`);
