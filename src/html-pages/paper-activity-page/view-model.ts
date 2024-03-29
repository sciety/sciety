import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { HtmlFragment } from '../../types/html-fragment';
import * as EL from '../../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { ListId } from '../../types/list-id';
import { PaperActivitySummaryCardViewModel } from '../../shared-components/paper-activity-summary-card';
import { LanguageCode } from '../../shared-components/lang-attribute';
import { GroupLinkWithLogoViewModel } from '../../shared-components/group-link';
import { CurationStatement } from '../../read-side/curation-statements';
import { ExpressionDoi } from '../../types/expression-doi';

export type EvaluationPublishedFeedItem = {
  type: 'evaluation-published',
  id: EL.EvaluationLocator,
  sourceHref: O.Option<URL>,
  publishedAt: Date,
  groupName: string,
  groupHref: string,
  groupAvatar: string,
  fullText: O.Option<SanitisedHtmlFragment>,
  fullTextLanguageCode: O.Option<LanguageCode>,
};

export type ExpressionPublishedFeedItem = {
  type: 'expression-published',
  source: URL,
  publishedAt: Date,
  server: O.Option<ArticleServer>,
  doi: ExpressionDoi,
  publishedTo: string,
};

export type FeedItem =
  | EvaluationPublishedFeedItem
  | ExpressionPublishedFeedItem;

type ListSummary = {
  listName: string,
  listId: ListId,
  listHref: string,
};

export type SaveArticleCta = {
  saveArticleHref: string,
};

type ContainingList = ListSummary;

export type LoggedInUserListManagement = E.Either<SaveArticleCta, ContainingList>;

export type ViewModel = {
  title: string,
  titleLanguageCode: O.Option<LanguageCode>,
  authors: ArticleAuthors,
  expressionFullTextHref: string,
  abstract: HtmlFragment,
  abstractLanguageCode: O.Option<LanguageCode>,
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
  feedItemsByDateDescending: ReadonlyArray<FeedItem>,
  userListManagement: O.Option<LoggedInUserListManagement>,
  listedIn: ReadonlyArray<{ listId: ListId, listName: string, listOwnerName: string, listHref: string }>,
  relatedArticles: O.Option<ReadonlyArray<PaperActivitySummaryCardViewModel>>,
  curationStatements: ReadonlyArray<CurationStatement>,
  reviewingGroups: ReadonlyArray<GroupLinkWithLogoViewModel>,
};
