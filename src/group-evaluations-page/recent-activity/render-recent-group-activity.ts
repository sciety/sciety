import * as RA from 'fp-ts/ReadonlyArray';
import { flow } from 'fp-ts/function';
import { ArticleViewModel, renderArticleCard } from '../../shared-components/article-card';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type RenderRecentGroupActivity = (
  groupId: GroupId,
  pageNumber: number
) => (
  articleViewModels: ReadonlyArray<ArticleViewModel>,
) => HtmlFragment;

export const renderRecentGroupActivity: RenderRecentGroupActivity = (groupId, pageNumber) => flow(
  RA.map(renderArticleCard),
  RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
  (renderedActivities) => `
    <div>
      <ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>
      <div class="search-results__link_container">
        <a href="/groups/${groupId}/recently-evaluated?page=${pageNumber + 1}" class="search-results__next_link">Next</a>
      </div>
    </div>
  `,
  toHtmlFragment,
);
