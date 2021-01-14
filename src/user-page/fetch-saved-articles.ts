import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import Doi from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type GetArticleTitle = (doi: Doi) => T.Task<O.Option<HtmlFragment>>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: O.Option<HtmlFragment>,
};

const constructSavedArticle = (getArticleTitle: GetArticleTitle) => (doi: Doi) => pipe(
  doi,
  getArticleTitle,
  T.map((title) => ({
    doi,
    title,
  })),
);

type FetchSavedArticles = (articles: ReadonlyArray<Doi>) => T.Task<ReadonlyArray<SavedArticle>>;

export const fetchSavedArticles = (getArticleTitle: GetArticleTitle): FetchSavedArticles => (
  T.traverseArray(constructSavedArticle(getArticleTitle))
);
