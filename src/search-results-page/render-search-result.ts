import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { templateDate } from '../shared-components';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type ArticleViewModel = {
  _tag: 'Article',
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
  latestVersionDate: O.Option<Date>,
  reviewCount: number,
};

type GroupViewModel = {
  _tag: 'Group',
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  followerCount: number,
  reviewCount: number,
};

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const renderFollowerCount = (followerCount: number): HtmlFragment => pipe(
  `${followerCount} ${followerCount === 1 ? 'follower' : 'followers'}`,
  toHtmlFragment,
);

const renderEvaluationCount = (evaluationCount: number): HtmlFragment => pipe(
  `${evaluationCount} ${evaluationCount === 1 ? 'evaluation' : 'evaluations'}`,
  toHtmlFragment,
);

const renderArticleVersionDate = (result: ArticleViewModel) => pipe(
  result.latestVersionDate,
  O.fold(
    () => `Posted ${templateDate(result.postedDate)}`,
    (latestVersionDate) => `Latest version ${templateDate(latestVersionDate)}`,
  ),
);

const renderArticleSearchResult = flow(
  (result: ArticleViewModel) => `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/${result.doi.value}">${result.title}</a>
      <div class="search-results-list__item__description">
        ${result.authors}
      </div>
      <ul class="search-results-list__item__meta">
        <li class="search-results-list__item__meta__item">${renderEvaluationCount(result.reviewCount)}</li><li class="search-results-list__item__meta__item">${renderArticleVersionDate(result)}</li>
      </ul>
    </div>
  `,
  toHtmlFragment,
);

const renderGroupSearchResult = flow(
  (result: GroupViewModel) => `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/groups/${result.id.value}">${result.name}</a>
      <div class="search-results-list__item__description">
        ${result.description}
      </div>
      <ul class="search-results-list__item__meta">
        <li class="search-results-list__item__meta__item">${renderEvaluationCount(result.reviewCount)}</li><li class="search-results-list__item__meta__item">${renderFollowerCount(result.followerCount)}</li>
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
