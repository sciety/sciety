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

type GroupLinkWithLogoViewModel = { href: string, largeLogo: O.Option<string>, name: string };

export const renderGroupLinkWithLogo = ({ href, largeLogo, name }: GroupLinkWithLogoViewModel): HtmlFragment => toHtmlFragment(`
  <a href="${href}" class="group-link-with-logo">${renderGroupLogoWithTextFallback(largeLogo, name)}</a>
`);
