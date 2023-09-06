import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderGroupLinkWithLogo } from '../../../shared-components/group-link-with-logo';

export const renderRelatedGroups = (relatedGroups: ViewModel['relatedGroups']): HtmlFragment => (relatedGroups.tag === 'some-related-groups'
  ? pipe(
    relatedGroups.items,
    RA.map((relatedGroup) => `
      <li role="listitem" class="related-groups__list_item">
       ${renderGroupLinkWithLogo('left')(relatedGroup)}
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
