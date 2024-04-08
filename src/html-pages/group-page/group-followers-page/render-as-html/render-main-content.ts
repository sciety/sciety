import { htmlEscape } from 'escape-goat';
import { flow, pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { renderLegacyPaginationControls } from '../../../shared-components/pagination';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel, UserCardViewModel } from '../view-model';
import { renderCountWithDescriptor } from '../../../../shared-components/render-count-with-descriptor';

const renderUserCard = (userCard: UserCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="user-card">
    <div class="user-card__body">
      <h3 class="user-card__title"><a href="${userCard.link}" class="user-card__link">${htmlEscape(userCard.title)}</a></h3>
      <div class="user-card__handle">@${userCard.handle}</div>
      <span class="user-card__meta"><span class="visually-hidden">This user has </span><span>${renderCountWithDescriptor(userCard.listCount, 'list', 'lists')}</span><span>${userCard.followedGroupCount} groups followed</span></span>
    </div>
    <img class="user-card__avatar" src="${userCard.avatarUrl}" alt="">
  </article>
`);

const renderFollowersList = (userCards: ReadonlyArray<UserCardViewModel>) => pipe(
  userCards,
  RA.map(flow(
    renderUserCard,
    (userCard) => `<li>${userCard}</li>`,
  )),
  (items) => (items.length === 0 ? '' : `
    <ol class="card-list" role="list">
      ${items.join('')}
    </ol>
  `),
);

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  `
    <p>
      ${renderCountWithDescriptor(viewmodel.followerCount, 'user is', 'users are')} following this group.
    </p>
    ${renderFollowersList(viewmodel.followers)}
    ${renderLegacyPaginationControls(viewmodel.pagination)}
  `,
  toHtmlFragment,
);
