import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserSavedArticleEvent } from '../../domain-events';
import { templateDate } from '../../shared-components/date';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

export type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, {
  handle: string,
  avatarUrl: string,
}>;

type UserSavedArticleToAListCard = (
  getUserDetails: GetUserDetails
) => (event: UserSavedArticleEvent) => TE.TaskEither<DE.DataError, HtmlFragment>;

export const userSavedArticleToAListCard: UserSavedArticleToAListCard = (getUserDetails) => (event) => pipe(
  event.userId,
  getUserDetails,
  TE.map(({ handle, avatarUrl }) => `
    <article class="sciety-feed-card">
      <a href="/users/${handle}/lists/saved-articles" class="sciety-feed-card__link">
        <div class="sciety-feed-card__event_title">
          <img class="sciety-feed-card__avatar" src="${avatarUrl}" alt="">
          <h2 class="sciety-feed-card__event_title_text">${handle} saved an article to a list</h2>
          ${templateDate(event.date, 'sciety-feed-card__event_date')}
        </div>
        <div class="sciety-feed-card__article_details">
          <h3 class="list-card__title">Saved articles</h3>
          <p>Articles that have been saved by @${handle}, most recently saved first.</p>
        </div>
      </a>
    </article>
  `),
  TE.map(toHtmlFragment),
);
