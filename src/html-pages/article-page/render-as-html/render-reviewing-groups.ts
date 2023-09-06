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
    (logoPath) => `<img src="${logoPath}"alt="${name}" class="article-actions-reviewing-groups__item_logo">`,
  ),
);

const createGroupLink = (group: ViewModel['reviewingGroups'][number]) => `
<a href="${group.href}" class="article-actions-reviewing-groups__item_link">${renderGroupLogoWithTextFallback(group.largeLogo, group.name)}</a>
`;

export const renderReviewingGroups = (reviewingGroups: ViewModel['reviewingGroups']): HtmlFragment => {
  if (reviewingGroups.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    reviewingGroups,
    RA.map(createGroupLink),
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
