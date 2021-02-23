import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { templateDate } from '../shared-components';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

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
  link: string,
  name: string,
};

export type SearchResult = ArticleSearchResult | GroupSearchResult;

const renderReviewCount = (reviewCount: number): string => `
  <div class="search-results-list__item__review-count">
    Reviews: ${reviewCount}
  </div>
`;

const renderReviews = flow(
  O.filter((reviewCount: number) => reviewCount > 0),
  O.fold(() => '', renderReviewCount),
  toHtmlFragment,
);

const templatePostedDate = flow(
  templateDate,
  (date) => `<div class="search-results-list__item__date">Posted ${date}</div>`,
);

type RenderArticleSearchResult = (result: ArticleSearchResult) => T.Task<HtmlFragment>;

const renderArticleSearchResult: RenderArticleSearchResult = flow(
  T.of,
  T.map((result) => `
    <div>
      <a class="search-results-list__item__link" href="/articles/${result.doi.value}">${result.title}</a>
      <div>
        ${result.authors}
      </div>
      ${templatePostedDate(result.postedDate)}
      ${renderReviews(result.reviewCount)}
    </div>
  `),
  T.map(toHtmlFragment),
);

type RenderGroupSearchResult = (result: GroupSearchResult) => T.Task<HtmlFragment>;

const renderGroupSearchResult: RenderGroupSearchResult = (result) => pipe(
  `<a href="${result.link}">${result.name}</a>`,
  toHtmlFragment,
  T.of,
);

export type RenderSearchResult = (result: SearchResult) => T.Task<HtmlFragment>;

export const renderSearchResult: RenderSearchResult = (result) => {
  switch (result._tag) {
    case 'Article':
      return renderArticleSearchResult(result);
    case 'Group':
      return renderGroupSearchResult(result);
  }
};
