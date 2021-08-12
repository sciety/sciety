import * as O from 'fp-ts/Option';
import { templateDate } from '../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type UserListCardViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  handle: string,
  avatarUrl: string,
  description: string,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

export const renderUserListCard = (viewModel: UserListCardViewModel): HtmlFragment => toHtmlFragment(`
  <a href="/users/${viewModel.handle}/lists/saved-articles" class="landing-page-list-card__link">
    <div class="landing-page-list-card">
      <div class="landing-page-list-card__body">
        <div>
          <h3 class="landing-page-list-card__title">@${viewModel.handle}</h3>
          <p>${viewModel.description}</p>
        </div>
        <div class="landing-page-list-card__meta">
          <span class="visually-hidden">This list contains </span><span>${viewModel.articleCount} article${viewModel.articleCount === 1 ? '' : 's'}</span>${lastUpdated(viewModel.lastUpdated)}
        </div>
      </div>
      <img class="landing-page-list-card__avatar" src="${viewModel.avatarUrl}" alt="" />
    </div>
  </a>
`);
