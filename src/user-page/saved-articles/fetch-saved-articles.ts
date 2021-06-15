import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

export type FetchArticle = (doi: Doi) => TE.TaskEither<unknown, { title: HtmlFragment }>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: HtmlFragment,
};

const constructSavedArticle = (getArticleTitle: FetchArticle) => (doi: Doi) => pipe(
  doi,
  getArticleTitle,
  TE.map(({ title }) => ({ doi, title })),
);

type FetchSavedArticles = (articles: ReadonlyArray<Doi>) => TE.TaskEither<unknown, ReadonlyArray<SavedArticle>>;

export const fetchSavedArticles = (getArticleTitle: FetchArticle): FetchSavedArticles => (
  TE.traverseArray(constructSavedArticle(getArticleTitle))
);
