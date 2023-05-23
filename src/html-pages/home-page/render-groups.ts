import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { templateListItems } from '../../shared-components/list-items';

type GroupLinkViewModel = {
  link: string,
  logoPath: string,
  name: string,
};

const renderGroup = (groupLink: GroupLinkViewModel) => `<a href="${groupLink.link}" class="home-page-groups-list__link"><img src="${groupLink.logoPath}" alt="${groupLink.name}"></a>`;

export type GroupsViewModel = ReadonlyArray<GroupLinkViewModel>;

export const renderGroups = (viewModel: GroupsViewModel): HtmlFragment => pipe(
  viewModel,
  RA.map(renderGroup),
  RA.map(toHtmlFragment),
  templateListItems,
  (listContent) => `
<section class="home-page-groups">
  <h2 class="home-page-groups__title">Groups evaluating preprints on Sciety</h2>
  <ul class="home-page-groups-list">
  ${listContent}
  </ul>
  <div class="home-page-groups__button_wrapper">
    <a href="/groups" class="home-page-groups__button">See all evaluating groups</a>
  </div>
</section>
`,
  toHtmlFragment,
);
