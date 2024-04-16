import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructAnnotation } from './construct-annotation';
import { ViewModel } from './view-model';
import { Queries } from '../../../read-models';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../../../shared-components/paper-activity-summary-card';
import { constructViewModel as defaultVariantConstructViewModel } from '../../../shared-components/paper-activity-summary-card/construct-view-model';
import { ErrorViewModel } from '../../../shared-components/paper-activity-summary-card/render-error-as-html';
import { ViewModel as DefaultVariantViewModel } from '../../../shared-components/paper-activity-summary-card/view-model';
import { inputFieldNames } from '../../../standards';
import * as EDOI from '../../../types/expression-doi';
import { ListId } from '../../../types/list-id';

type Dependencies = ConstructPaperActivitySummaryCardViewModelDependencies & Queries;

const toArticleCardWithControlsAndAnnotationViewModel = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
  expressionDoi: EDOI.ExpressionDoi,
) => (articleCard: DefaultVariantViewModel): ViewModel => pipe(
  constructAnnotation(dependencies)(listId, expressionDoi),
  (annotation) => ({
    articleCard,
    annotation,
    controls: editCapability ? O.some({
      listId,
      expressionDoi,
      createAnnotationFormHref: O.isNone(annotation)
        ? O.some(`/annotations/create-annotation-form?${inputFieldNames.articleId}=${expressionDoi}&${inputFieldNames.listId}=${listId}`)
        : O.none,
    }) : O.none,
  }),
);

export const constructViewModel = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  expressionDoi: EDOI.ExpressionDoi,
): TE.TaskEither<ErrorViewModel, ViewModel> => pipe(
  expressionDoi,
  defaultVariantConstructViewModel(dependencies),
  TE.map(toArticleCardWithControlsAndAnnotationViewModel(
    dependencies,
    editCapability,
    listId,
    expressionDoi,
  )),
);
