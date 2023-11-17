import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information.js';
import { ArticleCardViewModel } from '../../shared-components/article-card/index.js';
import { LegacyPaginationControlsViewModel } from '../../shared-components/pagination/index.js';
import { GroupLinkWithLogoViewModel } from '../../shared-components/group-link/index.js';

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
  articleCards: ReadonlyArray<ArticleCardViewModel>,
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};
