import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ArticleCardViewModel } from './view-model';

export const renderReviewingGroupsWithLink = (reviewingGroups: ArticleCardViewModel['reviewingGroups']): HtmlFragment => {
  if (reviewingGroups.length === 0) {
    return toHtmlFragment('');
  }
  return pipe(
    reviewingGroups,
    RA.map((group) => `<a href="${group.groupPageHref}">${group.groupName}</a>`),
    (links) => links.join(', '),
    (groupNamesWithLinks) => `<p class="article-card__reviewing_groups">Reviewed by ${groupNamesWithLinks}</p>`,
    toHtmlFragment,
  );
};
