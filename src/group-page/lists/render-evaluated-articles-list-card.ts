import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import { Group } from '../../types/group';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type ViewModel = {
  group: Group,
  articleCount: number,
  lastUpdated: O.Option<Date>,
  href: string,
  title: string,
  description: string,
};

const lastUpdated = O.fold(
  () => '',
  (date: Date) => `<span>Last updated ${templateDate(date)}</span>`,
);

export const renderEvaluatedArticlesListCard = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <div class="list-card">
      <h3 class="list-card__title">
        <a href="${viewModel.href}" class="list-card__link">${viewModel.title}</a>
      </h3>
      <p>
        ${viewModel.description}
      </p>
      <div class="list-card__meta">
        <span class="visually-hidden">This group has evaluated </span><span>${viewModel.articleCount} articles</span>${lastUpdated(viewModel.lastUpdated)}
      </div>
    </div>
  `,
  toHtmlFragment,
);
