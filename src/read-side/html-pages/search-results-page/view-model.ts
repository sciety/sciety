import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../shared-components/article-card';
import { GroupLinkWithLogoViewModel } from '../shared-components/group-link';

type NoGroupsEvaluatedTheFoundArticles = {
  tag: 'no-groups-evaluated-the-found-articles',
};

export type SomeRelatedGroups = {
  tag: 'some-related-groups',
  items: ReadonlyArray<GroupLinkWithLogoViewModel>,
};

export type ViewModel = PaginationViewModel & {
  query: string,
  includeUnevaluatedPreprints: boolean,
  paperActivitySummaryCards: ReadonlyArray<ArticleCardViewModel>,
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};
