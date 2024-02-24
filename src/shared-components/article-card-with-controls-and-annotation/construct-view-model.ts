import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi.js';
import { constructViewModel as defaultVariantConstructViewModel } from '../paper-activity-summary-card/construct-view-model.js';
import { ErrorViewModel } from '../paper-activity-summary-card/render-error-as-html.js';
import { ListId } from '../../types/list-id.js';
import { ViewModel as DefaultVariantViewModel } from '../paper-activity-summary-card/view-model.js';
import { Queries } from '../../read-models/index.js';
import { constructAnnotation } from './construct-annotation.js';
import { ViewModel } from './view-model.js';
import { inputFieldNames } from '../../standards/index.js';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../paper-activity-summary-card/index.js';

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
