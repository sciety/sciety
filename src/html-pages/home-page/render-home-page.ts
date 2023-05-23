import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { hero } from './hero';

type ViewModel = {
  groups: HtmlFragment,
  cards: HtmlFragment,
};

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${hero}
    ${viewModel.groups}
    ${viewModel.cards}
  </div>
`);
