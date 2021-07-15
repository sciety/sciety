import { pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type ViewModel = {
  groupId: GroupId,
};

export const renderEvaluatedArticlesListCard = (viewModel: ViewModel): HtmlFragment => pipe(
  `<a href="/groups/${viewModel.groupId}/evaluated-articles">Evaluated articles</a>`,
  toHtmlFragment,
);
