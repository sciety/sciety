import * as O from 'fp-ts/lib/Option';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import Result from 'true-myth/result';
import Doi from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

// TODO: rename and separate shim from rest of this module
export type GetArticleFromCrossref = (doi: Doi) => T.Task<Result<{
  title: HtmlFragment;
}, unknown>>;

export type GetSavedArticleDois = (userId: UserId) => T.Task<ReadonlyArray<Doi>>;

type SavedArticle = {
  doi: Doi,
  title: O.Option<HtmlFragment>,
};

type GetSavedArticles = (userId: UserId) => T.Task<ReadonlyArray<SavedArticle>>;

export const getSavedArticles = (
  getArticleFromCrossref: GetArticleFromCrossref,
  getSavedArticleDois: GetSavedArticleDois,
): GetSavedArticles => flow(
  getSavedArticleDois,
  T.chain(flow(
    RA.map((doi) => (
      pipe(
        doi,
        getArticleFromCrossref,
        T.map((articleResult) => {
          const title = articleResult.mapOr(O.none, (article) => O.some(article.title));
          return {
            doi,
            title,
          };
        }),
      )
    )),
    T.sequenceArray,
  )),
);
