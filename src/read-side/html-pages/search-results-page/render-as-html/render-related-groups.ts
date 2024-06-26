import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderGroupLinkWithLogo } from '../../shared-components/group-link';
import { renderListItems } from '../../shared-components/list-items';
import { ViewModel } from '../view-model';

export const renderRelatedGroups = (relatedGroups: ViewModel['relatedGroups']): HtmlFragment => (relatedGroups.tag === 'some-related-groups'
  ? pipe(
    relatedGroups.items,
    RA.map(renderGroupLinkWithLogo('left')),
    (renderedGroups) => renderListItems(renderedGroups, 'related-groups__list_item'),
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
