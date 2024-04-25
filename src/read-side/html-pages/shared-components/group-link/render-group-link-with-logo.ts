import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { GroupLinkWithLogoViewModel } from './group-link-with-logo-view-model';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderGroupLogoWithTextFallback = (viewModel: GroupLinkWithLogoViewModel) => pipe(
  viewModel.logoSrc,
  O.match(
    () => htmlEscape(viewModel.groupName),
    (logoSrc) => `<img src="${logoSrc}"alt="${htmlEscape(viewModel.groupName)}" class="group-link-with-logo__logo">`,
  ),
);

const renderAlignmentClass = (logoHorizontalAlignment: 'left' | 'center') => {
  switch (logoHorizontalAlignment) {
    case 'left':
      return 'group-link-with-logo--left-align';
    case 'center':
      return 'group-link-with-logo--center-align';
  }
};

export const renderGroupLinkWithLogo = (logoHorizontalAlignment: 'left' | 'center') => (viewModel: GroupLinkWithLogoViewModel): HtmlFragment => pipe(
  viewModel,
  renderGroupLogoWithTextFallback,
  (logoWithTextFallback) => `
    <a href="${viewModel.href}" class="group-link-with-logo ${renderAlignmentClass(logoHorizontalAlignment)}">${logoWithTextFallback}</a>
  `,
  toHtmlFragment,
);
