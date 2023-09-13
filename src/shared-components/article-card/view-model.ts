import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../../types/article-authors';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { LanguageCode } from '../lang-attribute';
import { Doi } from '../../types/doi';

type CurationStatementTeaserViewModel = {
  groupPageHref: string,
  groupName: string,
  quote: SanitisedHtmlFragment,
  quoteLanguageCode: O.Option<LanguageCode>,
};

type ReviewingGroupViewModel = {
  groupPageHref: string,
  groupName: string,
};

export type ArticleCardViewModel = {
  articleId: Doi,
  articleLink: string,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityAt: O.Option<Date>,
  evaluationCount: O.Option<number>,
  listMembershipCount: O.Option<number>,
  curationStatementsTeasers: ReadonlyArray<CurationStatementTeaserViewModel>,
  reviewingGroups: ReadonlyArray<ReviewingGroupViewModel>,
};
