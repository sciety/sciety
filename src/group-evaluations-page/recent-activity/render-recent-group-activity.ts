import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { ArticleViewModel, renderArticleCard } from '../../shared-components/article-card';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type RenderRecentGroupActivity = (
  nextPageHref: O.Option<string>,
) => (
  articleViewModels: ReadonlyArray<ArticleViewModel>,
) => HtmlFragment;

export const renderRecentGroupActivity: RenderRecentGroupActivity = (nextPageHref) => flow(
  RA.map(renderArticleCard),
  RA.map((activity) => `<li class="group-activity-list__item">${activity}</li>`),
  (renderedActivities) => `
    <div>
      <ul class="group-activity-list" role="list">${renderedActivities.join('')}</ul>
      ${pipe(
    nextPageHref,
    O.fold(
      () => '',
      (href) => `
            <div class="search-results__link_container">
              <a href="${href}" class="search-results__next_link">Next</a>
            </div>
          `,
    ),
  )}
    </div>
  `,
  toHtmlFragment,
);
