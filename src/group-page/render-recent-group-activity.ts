import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import { renderArticleActivity } from '../shared-components';
import { toHtmlFragment } from '../types/html-fragment';

export const renderRecentGroupActivity = flow(
  RA.map(renderArticleActivity),
  RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
  (renderedActivities) => `
    <div class="hidden" id="group-activity-list-authors">This article's authors</div>
    <ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>
  `,
  toHtmlFragment,
);
