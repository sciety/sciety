import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListItems } from '../../../shared-components/render-list-items';

const renderGroupLogoWithTextFallback = (largeLogo: O.Option<string>, name: string) => pipe(
  largeLogo,
  O.fold(
    () => name,
    (logoPath) => `<img src="${logoPath}"alt="${name}" class="group-link-with-logo__logo">`,
  ),
);

type GroupLinkWithLogoViewModel = { href: string, largeLogo: O.Option<string>, name: string };

const renderGroupLinkWithLogo = ({ href, largeLogo, name }: GroupLinkWithLogoViewModel) => `
<a href="${href}" class="group-link-with-logo">${renderGroupLogoWithTextFallback(largeLogo, name)}</a>
`;

export const renderReviewingGroups = (reviewingGroups: ViewModel['reviewingGroups']): HtmlFragment => {
  if (reviewingGroups.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    reviewingGroups,
    RA.map(renderGroupLinkWithLogo),
    RA.map(toHtmlFragment),
    (listItems) => renderListItems(listItems, 'article-actions-reviewing-groups__item'),
    (listItems) => `
      <section>
        <h2 class="article-actions-heading"><span class="visually-hidden">This article has been </span>Reviewed by<span class="visually-hidden"> the following groups</span></h2>
        <ul role="list" class="article-actions-reviewing-groups">
          ${listItems}
        </ul>
      </section>
    `,
    toHtmlFragment,
  );
};
