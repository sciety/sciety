import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { defaultGroupListDescription } from '../../group-page/messages';
import { templateDate } from '../../shared-components/date';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderArticleCount = (articleCount: number) => pipe(
  articleCount === 1,
  (singular) => `<span>${articleCount} ${singular ? 'article' : 'articles'}</span>`,
);

const renderLastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

export const renderHeader = (group: Group, articleCount: number, lastUpdated: O.Option<Date>): HtmlFragment => pipe(
  `<header class="page-header page-header--group-evaluations">
    <h1>
      Evaluated Articles
    </h1>
    <p class="page-header__subheading">
      <img src="${group.avatarPath}" alt="" class="page-header__avatar">
      <span>A list by <a href="/groups/${group.slug}">${group.name}</a></span>
    </p>
    <p class="page-header__description">${defaultGroupListDescription(group.name)}.</p>
    <p class="page-header__meta"><span class="visually-hidden">This list contains </span>${renderArticleCount(articleCount)}${renderLastUpdated(lastUpdated)}</p>
  </header>`,
  toHtmlFragment,
);
