import * as O from 'fp-ts/Option';
import { constant, flow, pipe } from 'fp-ts/function';
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
  latestActivityDate: O.Option<Date>,
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

const wrapInSpan = (text: string) => toHtmlFragment(`<span>${text}</span>`);

const renderFollowerCount = (followerCount: number): HtmlFragment => pipe(
  followerCount === 1,
  (singular) => `${followerCount} ${singular ? 'follower' : 'followers'}`,
  wrapInSpan,
);

const renderEvaluationCount = (evaluationCount: number): HtmlFragment => pipe(
  evaluationCount === 1,
  (singular) => `${evaluationCount} ${singular ? 'evaluation' : 'evaluations'}`,
  wrapInSpan,
);

const renderArticleVersionDate = (result: ArticleViewModel): HtmlFragment => pipe(
  result.latestVersionDate,
  O.fold(
    () => `Posted ${templateDate(result.postedDate)}`,
    (latestVersionDate) => `Latest version ${templateDate(latestVersionDate)}`,
  ),
  wrapInSpan,
);

const renderArticleActivityDateMetaItem = O.fold(
  constant(toHtmlFragment('')),
  (date: Date) => pipe(
    `Latest activity ${templateDate(date)}`,
    wrapInSpan,
  ),
);

const renderArticleSearchResult = flow(
  (result: ArticleViewModel) => `
    <div class="search-results-list__item_container">
      <a class="search-results-list__item__link" href="/articles/activity/${result.doi.value}">${result.title}</a>
      <div class="search-results-list__item__description">
        ${result.authors}
      </div>
      <span class="search-results-list__item__meta">
        ${renderEvaluationCount(result.reviewCount)}${renderArticleVersionDate(result)}${renderArticleActivityDateMetaItem(result.latestActivityDate)}
      </span>
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
      <span class="search-results-list__item__meta">
        ${renderEvaluationCount(result.reviewCount)}${renderFollowerCount(result.followerCount)}
      </span>
    </div>
    <img class="search-results-list__item__avatar" src="${result.avatarPath}" alt="" />
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
