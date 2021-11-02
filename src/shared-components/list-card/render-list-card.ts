import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { templateDate } from '../date';

type ListCardViewModel = {
  articleCount: number,
  lastUpdated: O.Option<Date>,
  href: string,
  title: string,
  description: string,
  articleCountLabel: string,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

export const renderListCard = (viewModel: ListCardViewModel): HtmlFragment => toHtmlFragment(`
  <article class="list-card">
    <h3 class="list-card__title">
      <a href="${viewModel.href}" class="list-card__link">${viewModel.title}</a>
    </h3>
    <p>${viewModel.description}</p>
    <div class="list-card__meta">
      <span class="visually-hidden">${viewModel.articleCountLabel} </span><span>${viewModel.articleCount} article${viewModel.articleCount === 1 ? '' : 's'}</span>${lastUpdated(viewModel.lastUpdated)}
    </div>
  </article>
`);
