import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { templateDate } from '../shared-components';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type ArticleSearchResult = {
  _tag: 'Article',
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
  reviewCount: O.Option<number>,
};

type GroupSearchResult = {
  _tag: 'Group',
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  followerCount: number,
  reviewCount: number,
};

export type SearchResult = ArticleSearchResult | GroupSearchResult;

const renderReviewCount = (reviewCount: number) => `
  <li class="search-results-list__item__meta__item">
    ${reviewCount} Reviews
  </li>
`;

const renderReviews = flow(
  O.filter((reviewCount: number) => reviewCount > 0),
  O.fold(() => '', renderReviewCount),
  toHtmlFragment,
);

const renderArticleSearchResult = flow(
  (result: ArticleSearchResult) => `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/${result.doi.value}">${result.title}</a>
      <div class="search-results-list__item__description">
        ${result.authors}
      </div>
      <ul class="search-results-list__item__meta">
        ${renderReviews(result.reviewCount)}<li class="search-results-list__item__meta__item">Posted ${templateDate(result.postedDate)}</li>
      </ul>      
    </div>
  `,
  toHtmlFragment,
);

const renderGroupSearchResult = (result: GroupSearchResult) => pipe(
  `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/groups/${result.id.value}">${result.name}</a>
      <div class="search-results-list__item__description">
        ${result.description}
      </div>
      <ul class="search-results-list__item__meta">
        <li class="search-results-list__item__meta__item">${result.reviewCount} Reviews</li><li class="search-results-list__item__meta__item">${result.followerCount} Followers</li>
      </ul>
    </div>
    <img class="search-results-list__item__avatar" src="${result.avatarPath}" />
  `,
  toHtmlFragment,
);

export type RenderSearchResult = (result: SearchResult) => HtmlFragment;

export const renderSearchResult: RenderSearchResult = (result) => {
  switch (result._tag) {
    case 'Article':
      return renderArticleSearchResult(result);
    case 'Group':
      return renderGroupSearchResult(result);
  }
};
