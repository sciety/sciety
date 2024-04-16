import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Group } from '../../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export type ViewModel = {
  title: string,
  group: Group,
};

const renderPageHeaderIdentity = (viewModel: ViewModel) => pipe(
  viewModel.group.largeLogoPath,
  O.match(
    () => `<h1>${htmlEscape(viewModel.title)}</h1>`,
    (largeLogoPath) => htmlEscape`
    <h1 class="page-header__visual_heading">
      <span class="visually-hidden">${viewModel.title}</span>
      <img src="${largeLogoPath}" alt="" class="page-header__large_logo" aria-hidden="true">
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
    <a href="/groups/${viewmodel.group.slug}" class="group-sub-page-back-link">Back to ${viewmodel.group.name}'s group page</a>
  </header>
`);
