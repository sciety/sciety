import * as O from 'fp-ts/Option';
import { templateDate } from '../../../shared-components/date';
import { renderListPageLinkHref } from '../../../shared-components/render-list-page-link-href';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';

type UserListCardViewModel = {
  listId: ListId,
  articleCount: number,
  updatedAt: O.Option<Date>,
  avatarUrl: string,
  listName: string,
  description: string,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

export const renderUserListCard = (viewModel: UserListCardViewModel): HtmlFragment => toHtmlFragment(`
  <a href="${renderListPageLinkHref(viewModel.listId)}" class="user-list-card__link">
    <article class="user-list-card">
      <div class="user-list-card__body">
        <div>
          <h3 class="user-list-card__title">${viewModel.listName}</h3>
          <p>${viewModel.description}</p>
        </div>
        <div class="user-list-card__meta">
          <span class="visually-hidden">This list contains </span><span>${viewModel.articleCount} article${viewModel.articleCount === 1 ? '' : 's'}</span>${lastUpdated(viewModel.updatedAt)}
        </div>
      </div>
      <img class="user-list-card__avatar" src="${viewModel.avatarUrl}" alt="" />
    </article>
  </a>
`);
