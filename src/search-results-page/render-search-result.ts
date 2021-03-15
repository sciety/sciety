import { flow, pipe } from 'fp-ts/function';
import { templateDate } from '../shared-components';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type ArticleViewModel = {
  _tag: 'Article',
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
  reviewCount: number,
};

export type GroupViewModel = {
  _tag: 'Group',
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  followerCount: number,
  reviewCount: number,
};

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const renderArticleSearchResult = flow(
  (result: ArticleViewModel) => `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/${result.doi.value}">${result.title}</a>
      <div class="search-results-list__item__description">
        ${result.authors}
      </div>
      <ul class="search-results-list__item__meta">
        <li class="search-results-list__item__meta__item">${result.reviewCount} Evaluations</li><li class="search-results-list__item__meta__item">Posted ${templateDate(result.postedDate)}</li>
      </ul>
    </div>
  `,
  toHtmlFragment,
);

const renderGroupSearchResult = (result: GroupViewModel) => pipe(
  `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/groups/${result.id.value}">${result.name}</a>
      <div class="search-results-list__item__description">
        ${result.description}
      </div>
      <ul class="search-results-list__item__meta">
        <li class="search-results-list__item__meta__item">${result.reviewCount} Evaluations</li><li class="search-results-list__item__meta__item">${result.followerCount} Followers</li>
      </ul>
    </div>
    <img class="search-results-list__item__avatar" src="${result.avatarPath}" />
  `,
  toHtmlFragment,
);

type RenderSearchResult = (result: ItemViewModel) => HtmlFragment;

export const renderSearchResult: RenderSearchResult = (result) => {
  switch (result._tag) {
    case 'Article':
      return renderArticleSearchResult(result);
    case 'Group':
      return renderGroupSearchResult(result);
  }
};
