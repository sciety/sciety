import * as B from 'fp-ts/boolean';
import * as O from 'fp-ts/Option';
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
    () => `<a href="/lists/${listId}/edit-details" class="list-page-actions__edit_details_link">Edit list details</a>`,
  ),
);

const renderRelatedArticlesLink = (url: O.Option<string>) => pipe(
  url,
  O.match(
    () => '',
    (u) => `<a class="list-page-actions__related_articles" href="${u}">Related articles (Labs 🧪)</a>`,
  ),
);

const renderSubscribeLink = () => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return '<a href="/nowhere">Subscribe</a>';
  }
  return '';
};

export const renderHeader = (viewModel: ViewModel): HtmlFragment => pipe(
  `<header class="page-header page-header--list">
    <h1>${viewModel.name}</h1>
    <p class="page-header__subheading">
      <img src="${viewModel.ownerAvatarPath}" alt="" class="page-header__avatar">
      <span>A list by <a href="${viewModel.ownerHref}">${viewModel.ownerName}</a></span>
    </p>
    <p class="page-header__description">${viewModel.description}</p>
    <p class="page-header__meta"><span class="visually-hidden">This list contains </span>${renderArticleCount(viewModel.articleCount)}${renderLastUpdated(viewModel.updatedAt)}</p>
    <section class="list-page-actions">
      ${renderEditDetailsLink(viewModel.editCapability, viewModel.listId)}
      ${renderRelatedArticlesLink(viewModel.relatedArticlesLink)}
      ${renderSubscribeLink()}
    </section>
  </header>`,
  toHtmlFragment,
);
