import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as E from 'fp-ts/Either';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import * as EL from '../../types/evaluation-locator';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { ListId } from '../../types/list-id';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { LanguageCode } from '../../shared-components/lang-attribute';
import { GroupLinkWithLogoViewModel } from '../../shared-components/group-link';
import { CurationStatementViewModel } from '../../shared-components/curation-statements';

export type EvaluationFeedItem = {
  type: 'evaluation',
  id: EL.EvaluationLocator,
  sourceHref: O.Option<URL>,
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

type SaveToAListForms = {
  lists: ReadonlyArray<ListSummary>,
};

type ContainingList = ListSummary;

export type LoggedInUserListManagement = E.Either<SaveToAListForms, ContainingList>;

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
  reviewingGroups: ReadonlyArray<GroupLinkWithLogoViewModel>,
};
