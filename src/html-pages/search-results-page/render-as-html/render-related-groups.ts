import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from '../view-model.js';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment.js';
import { renderGroupLinkWithLogo } from '../../../shared-components/group-link/index.js';
import { renderListItems } from '../../../shared-components/render-list-items.js';

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
