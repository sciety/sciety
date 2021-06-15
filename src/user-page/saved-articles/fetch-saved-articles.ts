import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetArticleTitle = (doi: Doi) => TO.TaskOption<HtmlFragment>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: HtmlFragment,
};

const constructSavedArticle = (getArticleTitle: GetArticleTitle) => (doi: Doi) => pipe(
  doi,
  getArticleTitle,
  TO.map((title) => ({ doi, title })),
);

type FetchSavedArticles = (articles: ReadonlyArray<Doi>) => TE.TaskEither<'unavailable', ReadonlyArray<SavedArticle>>;

export const fetchSavedArticles = (getArticleTitle: GetArticleTitle): FetchSavedArticles => flow(
  TO.traverseArray(constructSavedArticle(getArticleTitle)),
  T.map(E.fromOption(() => 'unavailable' as const)),
);
