import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { PaperActivitySummaryCardViewModel } from '../../shared-components/paper-activity-summary-card';
import { LegacyPaginationControlsViewModel } from '../../shared-components/pagination';
import { GroupLinkWithLogoViewModel } from '../../shared-components/group-link';

type NoGroupsEvaluatedTheFoundArticles = {
  tag: 'no-groups-evaluated-the-found-articles',
};

export type SomeRelatedGroups = {
  tag: 'some-related-groups',
  items: ReadonlyArray<GroupLinkWithLogoViewModel>,
};

export type ViewModel = PaginationViewModel & LegacyPaginationControlsViewModel & {
  query: string,
  evaluatedOnly: boolean,
  paperActivitySummaryCards: ReadonlyArray<PaperActivitySummaryCardViewModel>,
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};
