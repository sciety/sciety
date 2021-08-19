import { flow } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (followers: number) => HtmlFragment;

const userCardViewModel = {
  link: '/users/scietyhq',
  title: 'Sciety',
  handle: 'scietyHQ',
  listCount: 1,
  followedGroupCount: 13,
  avatarUrl: 'https://pbs.twimg.com/profile_images/1323645945179967488/DIp-lv6v_normal.png',
};

export const renderFollowers: RenderFollowers = flow(
  (followerCount) => `
    <p>
      ${followerCount} ${followerCount === 1 ? 'user is' : 'users are'} following this group.
    </p>
    ${
  process.env.EXPERIMENT_ENABLED === 'true'
    ? `
    <ul class="group-page-followers-list">
      <li class="group-page-followers-list__item">
        <article class="user-card">
          <div class="user-card__body">
            <h3 class="user-card__title"><a href="${userCardViewModel.link}" class="user-card__link">${userCardViewModel.title}</a></h3>
            <div class="user-card__handle">@${userCardViewModel.handle}</div>
            <span class="user-card__meta"><span class="visually-hidden">This user has </span><span>${userCardViewModel.listCount} list</span><span>${userCardViewModel.followedGroupCount} groups followed</span></span>
          </div>
          <img class="user-card__avatar" src="${userCardViewModel.avatarUrl}" alt="">
        </article>
      </li>
    </ul>
  `
    : ''
}
`,
  toHtmlFragment,
);
