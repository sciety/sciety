import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ViewModel } from '../view-model';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { renderListItems } from '../../../shared-components/render-list-items';
import { renderGroupLinkWithLogo } from '../../shared-components/group-link';

export const renderReviewingGroups = (reviewingGroups: ViewModel['reviewingGroups']): HtmlFragment => {
  if (reviewingGroups.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    reviewingGroups,
    RA.map(renderGroupLinkWithLogo('left')),
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
