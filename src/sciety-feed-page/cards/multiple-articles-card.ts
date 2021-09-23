import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

export type MultipleArticlesCard = {
  groupId: GroupId,
  articleCount: number,
  date: Date,
};

export const multipleArticlesCard = (
  getGroup: GetGroup,
) => (
  card: MultipleArticlesCard,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  card.groupId,
  getGroup,
  TO.map((group) => `
    <article class="sciety-feed-card">
      <a href="/groups/${group.slug}" class="sciety-feed-card__link">
        <div class="sciety-feed-card__event_title">
          <img class="sciety-feed-card__avatar" src="${group.avatarPath}" alt="" width="36" height="36">
          <h2 class="sciety-feed-card__event_title_text">${group.name} evaluated ${card.articleCount} articles</h2>
          ${templateDate(card.date, 'sciety-feed-card__event_date')}
        </div>
      </a>
    </article>
  `),
  TO.map(toHtmlFragment),
  T.map(E.fromOption(() => DE.unavailable)),
);
