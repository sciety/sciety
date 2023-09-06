import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderGroupLogoWithTextFallback = (viewModel: GroupLinkWithLogoViewModel) => pipe(
  viewModel.logoPath,
  O.fold(
    () => viewModel.groupName,
    (logoPath) => `<img src="${logoPath}"alt="${viewModel.groupName}" class="group-link-with-logo__logo">`,
  ),
);

export type GroupLinkWithLogoViewModel = {
  groupName: string,
  href: string,
  logoPath: O.Option<string>,
};

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
