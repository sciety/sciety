import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { GroupsViewModel, renderGroups } from './render-groups';
import { hero } from './hero';

type ViewModel = {
  groups: GroupsViewModel,
  cards: HtmlFragment,
};

export const renderHomepage = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <div class="home-page">
    ${hero}
    ${renderGroups(viewModel.groups)}
    ${viewModel.cards}
  </div>
`);
