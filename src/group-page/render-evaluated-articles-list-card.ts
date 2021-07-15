import { pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ViewModel = {
  groupId: GroupId,
};

export const renderEvaluatedArticlesListCard = (viewModel: ViewModel): HtmlFragment => pipe(
  `
    <div class="list-card">
      <h3 class="list-card__title">
        <a href="/groups/${viewModel.groupId}/evaluated-articles" class="list-card__link">Evaluated articles</a>
      </h3>
    </div>
  `,
  toHtmlFragment,
);
