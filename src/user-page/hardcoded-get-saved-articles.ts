import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/pipeable';
import Result from 'true-myth/result';
import { GetSavedArticles } from './render-saved-articles';
import Doi from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';

// TODO: rename and separate shim from rest of this module
export type GetArticleFromCrossref = (doi: Doi) => T.Task<Result<{
  title: HtmlFragment;
}, unknown>>;

export const getSavedArticles = (
  getArticleFromCrossref: GetArticleFromCrossref,
): GetSavedArticles => (userId) => {
  if (userId === '1295307136415735808') {
    const dois = RA.fromArray([
      new Doi('10.1101/2020.07.04.187583'),
      new Doi('10.1101/2020.09.09.289785'),
    ]);
    return pipe(
      dois,
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
    );
  }
  return T.of([]);
};
