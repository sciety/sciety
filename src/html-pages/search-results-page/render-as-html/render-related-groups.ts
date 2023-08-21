import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderRelatedGroups = (relatedGroups: ViewModel['relatedGroups']): HtmlFragment => (relatedGroups.tag === 'some-related-groups'
  ? pipe(
    relatedGroups.groups,
    RA.map((relatedGroup) => `
      <li role="listitem">
        <a href="${relatedGroup.path}">${relatedGroup.name}</a>
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
