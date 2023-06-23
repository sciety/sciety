import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as E from 'fp-ts/Either';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import * as RI from '../../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { ListId } from '../../types/list-id';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { LanguageCode } from '../../shared-components/lang-attribute';
import * as GID from '../../types/group-id';

export type EvaluationFeedItem = {
  type: 'evaluation',
  id: RI.EvaluationLocator,
  source: O.Option<URL>,
  publishedAt: Date,
  groupName: string,
  groupHref: string,
  groupAvatar: string,
  fullText: O.Option<SanitisedHtmlFragment>,
  fullTextLanguageCode: O.Option<LanguageCode>,
};

export type ArticleVersionFeedItem = {
  type: 'article-version',
  source: URL,
  publishedAt: Date,
  version: number,
  server: ArticleServer,
};

type ArticleVersionErrorFeedItem = {
  type: 'article-version-error',
  server: ArticleServer,
};

export type FeedItem =
  | EvaluationFeedItem
  | ArticleVersionFeedItem
  | ArticleVersionErrorFeedItem;

type ListSummary = {
  listName: string,
  listId: ListId,
};

type ArticleNotInAnyList = {
  lists: ReadonlyArray<ListSummary>,
};

type ArticleSavedToThisList = ListSummary;

export type LoggedInUserListManagement = E.Either<ArticleNotInAnyList, ArticleSavedToThisList>;

type CurationStatementViewModel = {
  groupId: GID.GroupId,
  groupName: string,
  groupSlug: string,
  groupLogo: O.Option<string>,
  fullText: string,
  fullTextLanguageCode: O.Option<LanguageCode>,
};

export type ViewModel = {
  doi: Doi,
  title: string,
  titleLanguageCode: O.Option<LanguageCode>,
  authors: ArticleAuthors,
  fullArticleUrl: string,
  abstract: HtmlFragment,
  abstractLanguageCode: O.Option<LanguageCode>,
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
  feedItemsByDateDescending: RNEA.ReadonlyNonEmptyArray<FeedItem>,
  userListManagement: O.Option<LoggedInUserListManagement>,
  listedIn: ReadonlyArray<{ listId: ListId, listName: string, listOwnerName: string }>,
  relatedArticles: O.Option<ReadonlyArray<ArticleCardViewModel>>,
  curationStatements: ReadonlyArray<CurationStatementViewModel>,
};
