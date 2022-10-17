import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { ArticleVersionFeedItem } from './render-as-html/render-article-version-feed-item';
import { ReviewFeedItem } from './render-as-html/render-review-feed-item';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';

type ArticleVersionErrorFeedItem = { type: 'article-version-error', server: ArticleServer };

export type FeedItem = ReviewFeedItem | ArticleVersionFeedItem | ArticleVersionErrorFeedItem;

export type ViewModel = {
  doi: Doi,
  title: string,
  userListUrl: O.Option<string>,
  authors: ArticleAuthors,
  fullArticleUrl: string,
  articleAbstract: HtmlFragment,
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
  feedItemsByDateDescending: RNEA.ReadonlyNonEmptyArray<FeedItem>,
};
