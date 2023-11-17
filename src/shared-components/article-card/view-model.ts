import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../../types/article-authors.js';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment.js';
import { LanguageCode } from '../lang-attribute/index.js';
import { ArticleId } from '../../types/article-id.js';
import { GroupLinkAsTextViewModel } from '../group-link/index.js';

type CurationStatementTeaserViewModel = {
  groupPageHref: string,
  groupName: string,
  quote: SanitisedHtmlFragment,
  quoteLanguageCode: O.Option<LanguageCode>,
};

export type ViewModel = {
  articleId: ArticleId,
  articleHref: string,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
  latestVersionDate: O.Option<Date>,
  latestActivityAt: O.Option<Date>,
  evaluationCount: O.Option<number>,
  listMembershipCount: O.Option<number>,
  curationStatementsTeasers: ReadonlyArray<CurationStatementTeaserViewModel>,
  reviewingGroups: ReadonlyArray<GroupLinkAsTextViewModel>,
};
