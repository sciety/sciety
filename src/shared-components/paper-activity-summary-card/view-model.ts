import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../../types/article-authors';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { LanguageCode } from '../lang-attribute';
import { GroupLinkAsTextViewModel } from '../group-link';

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
