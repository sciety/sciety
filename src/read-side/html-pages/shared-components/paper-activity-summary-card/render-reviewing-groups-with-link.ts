import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './view-model';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderGroupLinkAsText } from '../group-link';

export const renderReviewingGroupsWithLink = (reviewingGroups: ViewModel['reviewingGroups']): HtmlFragment => {
  if (reviewingGroups.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    reviewingGroups,
    RA.map(renderGroupLinkAsText),
    (links) => links.join(', '),
    (groupNamesWithLinks) => `<p class="article-card__reviewing_groups">Reviewed by ${groupNamesWithLinks}</p>`,
    toHtmlFragment,
  );
};
