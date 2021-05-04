import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import { renderArticleCard } from '../shared-components';
import { toHtmlFragment } from '../types/html-fragment';

export const renderRecentGroupActivity = flow(
  RA.map(renderArticleCard),
  RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
  (renderedActivities) => `
    <ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>
  `,
  toHtmlFragment,
);
