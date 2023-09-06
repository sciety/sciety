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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderGroupLinkWithLogo = (logoHorizontalAlignment: 'left' | 'center') => (viewModel: GroupLinkWithLogoViewModel): HtmlFragment => toHtmlFragment(`
  <a href="${viewModel.href}" class="group-link-with-logo">${renderGroupLogoWithTextFallback(viewModel.logoPath, viewModel.groupName)}</a>
`);
