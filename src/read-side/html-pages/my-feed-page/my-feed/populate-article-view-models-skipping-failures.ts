import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionActivity } from '../../../../types/expression-activity';
import * as EDOI from '../../../../types/expression-doi';
import { ArticleCardViewModel, constructArticleCard } from '../../shared-components/article-card';

type PopulateArticleViewModelsSkippingFailures = (
  dependencies: Dependencies,
) => (
  activities: ReadonlyArray<ExpressionActivity>
) => T.Task<ReadonlyArray<ArticleCardViewModel>>;

export const populateArticleViewModelsSkippingFailures: PopulateArticleViewModelsSkippingFailures = (
  dependencies,
) => (activities) => pipe(
  activities,
  RA.map((activity) => pipe(
    EDOI.fromValidatedString(activity.expressionDoi.value),
    constructArticleCard(dependencies),
    TO.fromTaskEither,
  )),
  T.sequenceArray,
  T.map(RA.compact),
);
