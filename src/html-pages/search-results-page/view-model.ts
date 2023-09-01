import * as O from 'fp-ts/Option';
import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';

type NoGroupsEvaluatedTheFoundArticles = {
  tag: 'no-groups-evaluated-the-found-articles',
};

export type SomeRelatedGroups = {
  tag: 'some-related-groups',
  items: ReadonlyArray<{
    groupPageHref: string,
    groupName: string,
    largeLogoUrl: O.Option<string>,
  }>,
};

export type ViewModel = PaginationViewModel & PaginationControlsViewModel & {
  query: string,
  evaluatedOnly: boolean,
  articleCards: ReadonlyArray<ArticleCardViewModel>,
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};
