import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GroupViewModel = {
  _tag: 'Group',
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  followerCount: number,
  reviewCount: number,
};

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

export const renderGroupSearchResult = flow(
  (result: GroupViewModel) => `
    <div class="search-results-list__item_container">
      <div class="search-results-list__item_body">
        <a class="search-results-list__item__link" href="/groups/${result.id.value}">${result.name}</a>
        <div class="search-results-list__item__description">
          ${result.description}
        </div>
        <span class="search-results-list__item__meta">
          ${renderEvaluationCount(result.reviewCount)}${renderFollowerCount(result.followerCount)}
        </span>      
      </div>
      <img class="search-results-list__item__avatar" src="${result.avatarPath}" alt="" />
    </div>
  `,
  toHtmlFragment,
);
