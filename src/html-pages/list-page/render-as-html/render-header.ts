import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';
import { ViewModel } from '../view-model';

const renderArticleCount = (articleCount: number) => pipe(
  articleCount === 1,
  (singular) => `<span>${articleCount} ${singular ? 'article' : 'articles'}</span>`,
);

const renderLastUpdated = (date: Date) => `<span>Last updated ${templateDate(date)}</span>`;

const renderEditDetailsLink = (editCapability: boolean, listId: ListId) => pipe(
  editCapability,
  B.fold(
    () => '',
    () => `<a href="/lists/${listId}/edit-details" class="page-header__edit_details_link">Edit list details</a>`,
  ),
);

export const renderHeader = (viewModel: ViewModel): HtmlFragment => pipe(
  `<header class="page-header page-header--list">
    <h1>${viewModel.name}</h1>
    <p class="page-header__subheading">
      <img src="${viewModel.ownerAvatarPath}" alt="" class="page-header__avatar">
      <span>A list by <a href="${viewModel.ownerHref}">${viewModel.ownerName}</a></span>
    </p>
    <p class="page-header__description">${viewModel.description}</p>
    <p class="page-header__meta"><span class="visually-hidden">This list contains </span>${renderArticleCount(viewModel.articleCount)}${renderLastUpdated(viewModel.updatedAt)}</p>
    <section>
      ${renderEditDetailsLink(viewModel.editCapability, viewModel.listId)}
      <a class="page-header__related_articles"href="https://labs.sciety.org/lists/by-id/${viewModel.listId}/article-recommendations?from-sciety=true">Related articles (Labs 🧪)</a>
    </section>
  </header>`,
  toHtmlFragment,
);
