import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderFollowToggle } from '../../common-components/render-follow-toggle';
import { ViewModel } from '../view-model';

const renderPageHeaderIdentity = (group: ViewModel['group']) => pipe(
  group.largeLogoPath,
  O.match(
    () => `<h1>${htmlEscape(group.name)}</h1>`,
    (largeLogoPath) => htmlEscape`
    <h1 class="page-header__visual_heading">
      <img src="${largeLogoPath}" alt="${group.name}" class="page-header__large_logo">
    </h1>
  `,
  ),
);

export const renderPageHeader = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel.group)}
    </div>
    <p class="group-page-short-description">
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
    <div class="group-page-actions">
      ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
    </div>
  </header>
`);
