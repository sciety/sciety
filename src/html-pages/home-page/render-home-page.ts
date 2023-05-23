import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { GroupsViewModel, renderGroups } from './render-groups';
import { hero } from './hero';

export type ViewModel = {
  groups: O.Option<GroupsViewModel>,
  cards: HtmlFragment,
};

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
    ${viewModel.cards}
  </div>
`);
