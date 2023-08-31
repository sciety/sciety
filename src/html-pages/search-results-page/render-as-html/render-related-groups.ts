import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ArticlesCategoryViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

const foo = (relatedGroup: (ArticlesCategoryViewModel['relatedGroups'] & { tag: 'some-related-groups' })['items'][number]) => pipe(
  relatedGroup.largeLogoUrl,
  O.match(
    () => '',
    (largeLogoUrl) => `<a href="${relatedGroup.groupPageHref}" class="related-groups__link">
    <img src="${largeLogoUrl}" alt="${relatedGroup.groupName}">
    </a>`,
  ),
);

export const renderRelatedGroups = (relatedGroups: ArticlesCategoryViewModel['relatedGroups']): HtmlFragment => (relatedGroups.tag === 'some-related-groups'
  ? pipe(
    relatedGroups.items,
    RA.map((relatedGroup) => `
      <li role="listitem">
       ${foo(relatedGroup)}
      </li>
    `),
    (items) => items.join(''),
    (listContent) => `
      <section class="related-groups">
        <h2>Related groups</h2>
        <ul role="list" class="related-groups__list">
        ${listContent}
        </ul>
      </section>
    `,
    toHtmlFragment,
  )
  : toHtmlFragment(''));
