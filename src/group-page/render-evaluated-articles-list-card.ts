import { pipe } from 'fp-ts/function';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ViewModel = {
  group: Group,
  articleCount: number,
};

export const renderEvaluatedArticlesListCard = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <div class="list-card">
      <h3 class="list-card__title">
        <a href="/groups/${viewModel.group.id}/evaluated-articles" class="list-card__link">Evaluated articles</a>
      </h3>
      <p>
        Articles that have been evaluated by ${viewModel.group.name},
        ordered by most recent.
      </p>
      <div class="list-card__meta">
      </div>
    </div>
  `,
  toHtmlFragment,
);
