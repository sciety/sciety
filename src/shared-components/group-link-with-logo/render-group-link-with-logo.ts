import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderGroupLogoWithTextFallback = (largeLogo: O.Option<string>, name: string) => pipe(
  largeLogo,
  O.fold(
    () => name,
    (logoPath) => `<img src="${logoPath}"alt="${name}" class="group-link-with-logo__logo">`,
  ),
);

export type GroupLinkWithLogoViewModel = {
  groupName: string,
  href: string,
  logoPath: O.Option<string>,
};

const renderLinkClass = (logoHorizontalAlignment: 'left' | 'center') => (
  logoHorizontalAlignment === 'center'
    ? 'class="group-link-with-logo group-link-with-logo--center-align"'
    : 'class="group-link-with-logo group-link-with-logo--left-align"'
);

export const renderGroupLinkWithLogo = (logoHorizontalAlignment: 'left' | 'center') => (viewModel: GroupLinkWithLogoViewModel): HtmlFragment => toHtmlFragment(`
  <a href="${viewModel.href}" ${renderLinkClass(logoHorizontalAlignment)}>${renderGroupLogoWithTextFallback(viewModel.logoPath, viewModel.groupName)}</a>
`);
