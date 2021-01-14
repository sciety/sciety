import * as O from 'fp-ts/lib/Option';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import Result from 'true-myth/result';
import Doi from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type GetArticleTitle = (doi: Doi) => T.Task<Result<HtmlFragment, unknown>>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: O.Option<HtmlFragment>,
};

type FetchSavedArticles = (articles: ReadonlyArray<Doi>) => T.Task<ReadonlyArray<SavedArticle>>;

export const fetchSavedArticles = (
  getArticleFromCrossref: GetArticleTitle,
): FetchSavedArticles => flow(
  RA.map((doi) => (
    pipe(
      doi,
      getArticleFromCrossref,
      T.map((articleResult) => ({
        doi,
        title: articleResult.mapOr(O.none, (title) => O.some(title)),
      })),
    )
  )),
  T.sequenceArray,
);
