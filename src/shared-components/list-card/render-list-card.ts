import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { templateDate } from '../date';
import { renderListPageLinkHref } from '../render-list-page-link-href';

export type ListCardViewModel = {
  listId: ListId,
  articleCount: number,
  updatedAt: O.Option<Date>,
  title: string,
  description: string,
  avatarUrl: O.Option<string>,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

const renderAvatar = O.fold(
  () => '',
  (avatarUrl: string) => `<img class="list-card__avatar" src="${avatarUrl}" alt="" />`,
);

const pluraliseArticleCount = (articleCount: number) => `${articleCount} article${articleCount === 1 ? '' : 's'}`;

export const renderListCard = (viewModel: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="list-card">
    <div class="list-card__body">
      <div>
        <h3 class="list-card__title"><a href="${renderListPageLinkHref(viewModel.listId)}" class="list-card__link">${viewModel.title}</a></h3>
        <p>${viewModel.description}</p>
      </div>
      <div class="list-card__meta">
        <span class="visually-hidden">This list contains </span><span>${pluraliseArticleCount(viewModel.articleCount)}</span>${lastUpdated(viewModel.updatedAt)}
      </div>
    </div>
    ${renderAvatar(viewModel.avatarUrl)}
  </article>
`);
