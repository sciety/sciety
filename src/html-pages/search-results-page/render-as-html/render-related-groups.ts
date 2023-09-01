import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

const renderLargeLogoLink = (relatedGroup: (ViewModel['relatedGroups'] & { tag: 'some-related-groups' })['items'][number]) => pipe(
  relatedGroup.largeLogoUrl,
  O.match(
    () => '',
    (largeLogoUrl) => `<a href="${relatedGroup.groupPageHref}" class="related-groups__link">
    <img src="${largeLogoUrl}" alt="${relatedGroup.groupName}">
    </a>`,
  ),
);

export const renderRelatedGroups = (relatedGroups: ViewModel['relatedGroups']): HtmlFragment => (relatedGroups.tag === 'some-related-groups'
  ? pipe(
    relatedGroups.items,
    RA.map((relatedGroup) => `
      <li role="listitem">
       ${renderLargeLogoLink(relatedGroup)}
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
