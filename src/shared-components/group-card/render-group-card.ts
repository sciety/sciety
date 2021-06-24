import { htmlEscape } from 'escape-goat';
import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

export type GroupViewModel = {
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

export const renderGroupCard = flow(
  (result: GroupViewModel) => `
    <div class="group-card">
      <div class="group-card__body">
        <h3 class="group-card__title">
          <a class="group-card__link" href="/groups/${result.id}">${htmlEscape(result.name)}</a>
        </h3>
        <div class="group-card__description">
          ${result.description}
        </div>
        <span class="group-card__meta">
          ${renderEvaluationCount(result.reviewCount)}${renderFollowerCount(result.followerCount)}
        </span>
      </div>
      <img class="group-card__avatar" src="${result.avatarPath}" alt="" />
    </div>
  `,
  toHtmlFragment,
);
