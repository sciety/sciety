import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as EDOI from '../../../../types/expression-doi';
import { ArticleCardViewModel, constructArticleCard } from '../../shared-components/article-card';

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Dependencies,
) => (
  expressionDois: ReadonlyArray<EDOI.ExpressionDoi>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (expressionDois) => pipe(
  expressionDois,
  RA.map((expressionDoi) => pipe(
    expressionDoi,
    constructArticleCard(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
