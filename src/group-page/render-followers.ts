import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type FollowerListViewModel = {
  followerCount: number,
};

type RenderFollowers = (followerListViewModel: FollowerListViewModel) => HtmlFragment;

type UserCardViewModel = {
  link: string,
  title: string,
  handle: string,
  listCount: number,
  followedGroupCount: number,
  avatarUrl: string,
};

const userCardViewModel = {
  link: '/users/scietyhq',
  title: 'Sciety',
  handle: 'scietyHQ',
  listCount: 1,
  followedGroupCount: 13,
  avatarUrl: 'https://pbs.twimg.com/profile_images/1323645945179967488/DIp-lv6v_normal.png',
};

const renderUserCard = (userCard: UserCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="user-card">
    <div class="user-card__body">
      <h3 class="user-card__title"><a href="${userCard.link}" class="user-card__link">${userCard.title}</a></h3>
      <div class="user-card__handle">@${userCard.handle}</div>
      <span class="user-card__meta"><span class="visually-hidden">This user has </span><span>${userCard.listCount} list</span><span>${userCard.followedGroupCount} groups followed</span></span>
    </div>
    <img class="user-card__avatar" src="${userCard.avatarUrl}" alt="">
  </article>
`);

const renderFollowersList = (userCards: ReadonlyArray<UserCardViewModel>) => pipe(
  userCards,
  RA.map(flow(
    renderUserCard,
    (userCard) => `<li class="group-page-followers-list__item">${userCard}</li>`,
  )),
  (items) => `
    <ul class="group-page-followers-list">
      ${items.join('')}
    </ul>
  `,
);

export const renderFollowers: RenderFollowers = ({ followerCount }) => pipe(
  followerCount,
  (count) => `
    <p>
      ${count} ${count === 1 ? 'user is' : 'users are'} following this group.
    </p>
    ${
  process.env.EXPERIMENT_ENABLED === 'true'
    ? renderFollowersList([userCardViewModel])
    : ''
}
`,
  toHtmlFragment,
);
