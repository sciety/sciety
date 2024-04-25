import * as O from 'fp-ts/Option';
import { GroupLinkAsTextViewModel } from '../../read-side/html-pages/shared-components/group-link';
import { LanguageCode } from '../../read-side/html-pages/shared-components/lang-attribute';
import { ArticleAuthors } from '../../types/article-authors';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type CurationStatementTeaserViewModel = {
  groupPageHref: string,
  groupName: string,
  quote: SanitisedHtmlFragment,
  quoteLanguageCode: O.Option<LanguageCode>,
};

export type ViewModel = {
  paperActivityPageHref: string,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestPublishedAt: Date,
  latestActivityAt: O.Option<Date>,
  evaluationCount: O.Option<number>,
  listMembershipCount: O.Option<number>,
  curationStatementsTeasers: ReadonlyArray<CurationStatementTeaserViewModel>,
  reviewingGroups: ReadonlyArray<GroupLinkAsTextViewModel>,
};
