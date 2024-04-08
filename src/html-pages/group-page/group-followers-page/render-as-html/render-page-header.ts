import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderFollowToggle } from '../../common-components/render-follow-toggle';
import { ViewModel } from '../view-model';

const renderPageHeaderIdentity = (viewModel: ViewModel) => pipe(
  viewModel.group.largeLogoPath,
  O.match(
    () => `<h1><a href="/groups/${viewModel.group.slug}">${htmlEscape(viewModel.title)}</a></h1>`,
    (largeLogoPath) => htmlEscape`
    <h1 class="page-header__visual_heading">
      <a href="/groups/${viewModel.group.slug}"><img src="${largeLogoPath}" alt="${viewModel.title}" class="page-header__large_logo"></a>
    </h1>
  `,
  ),
);

export const renderPageHeader = (viewmodel: ViewModel): HtmlFragment => toHtmlFragment(`
  <header class="page-header">
    <div class="page-header__identity">
      ${renderPageHeaderIdentity(viewmodel)}
    </div>
    <p class="group-page-short-description">
      ${htmlEscape(viewmodel.group.shortDescription)}
    </p>
    <div class="group-page-actions">
      ${renderFollowToggle(viewmodel.group.id, viewmodel.group.name)(viewmodel.isFollowing)}
    </div>
  </header>
`);
