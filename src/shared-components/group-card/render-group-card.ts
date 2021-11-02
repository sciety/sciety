import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { templateDate } from '../date';

export type GroupViewModel = {
  id: GroupId,
  name: string,
  description: SanitisedHtmlFragment,
  avatarPath: string,
  slug: string,
  followerCount: number,
  reviewCount: number,
  latestActivity: O.Option<Date>,
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

const renderLatestActivity = (latestActivity: O.Option<Date>): HtmlFragment => pipe(
  latestActivity,
  O.fold(
    () => toHtmlFragment(''),
    flow(
      templateDate,
      (text) => `Latest activity ${text}`,
      wrapInSpan,
    ),
  ),
);

export const renderGroupCard = flow(
  (result: GroupViewModel) => `
    <article>
      <a class="group-card" href="/groups/${result.slug}">
        <div class="group-card__body">
          <h3 class="group-card__title">
            ${htmlEscape(result.name)}
          </h3>
          <div class="group-card__description">
            ${result.description}
          </div>
          <span class="group-card__meta">
            <span class="visually-hidden">This group has </span>${renderEvaluationCount(result.reviewCount)}${renderFollowerCount(result.followerCount)}${renderLatestActivity(result.latestActivity)}
          </span>
        </div>
        <img class="group-card__avatar" src="${result.avatarPath}" alt="" />
      </a>
    </article>
  `,
  toHtmlFragment,
);
