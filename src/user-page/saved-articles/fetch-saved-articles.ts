import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetArticleTitle = (doi: Doi) => TO.TaskOption<HtmlFragment>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: O.Option<HtmlFragment>,
};

const constructSavedArticle = (getArticleTitle: GetArticleTitle) => (doi: Doi) => pipe(
  doi,
  getArticleTitle,
  T.map((title) => ({ doi, title })),
);

type FetchSavedArticles = (articles: ReadonlyArray<Doi>) => T.Task<ReadonlyArray<SavedArticle>>;

export const fetchSavedArticles = (getArticleTitle: GetArticleTitle): FetchSavedArticles => (
  T.traverseArray(constructSavedArticle(getArticleTitle))
);
