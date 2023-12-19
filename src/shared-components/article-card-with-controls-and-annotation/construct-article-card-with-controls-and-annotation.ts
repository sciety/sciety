import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi';
import { constructViewModel } from '../paper-activity-summary-card/construct-view-model';
import { ErrorViewModel } from '../paper-activity-summary-card/render-error-as-html';
import { ListId } from '../../types/list-id';
import { ArticleId } from '../../types/article-id';
import { ViewModel } from '../paper-activity-summary-card/view-model';
import { Queries } from '../../read-models';
import { constructAnnotation } from './construct-annotation';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';
import { inputFieldNames } from '../../standards';
import { ConstructPaperActivitySummaryCardViewModelDependencies } from '../paper-activity-summary-card';

type Dependencies = ConstructPaperActivitySummaryCardViewModelDependencies & Queries;

const toArticleCardWithControlsAndAnnotationViewModel = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
  articleId: ArticleId,
) => (articleCard: ViewModel): ArticleCardWithControlsAndAnnotationViewModel => pipe(
  constructAnnotation(dependencies)(listId, articleId),
  (annotation) => ({
    articleCard,
    annotation,
    controls: editCapability ? O.some({
      listId,
      articleId,
      createAnnotationFormHref: O.isNone(annotation)
        ? O.some(`/annotations/create-annotation-form?${inputFieldNames.articleId}=${articleId.value}&${inputFieldNames.listId}=${listId}`)
        : O.none,
    }) : O.none,
  }),
);

export const constructArticleCardWithControlsAndAnnotation = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  articleId: ArticleId,
): TE.TaskEither<ErrorViewModel, ArticleCardWithControlsAndAnnotationViewModel> => pipe(
  EDOI.fromValidatedString(articleId.value),
  constructViewModel(dependencies),
  TE.map(toArticleCardWithControlsAndAnnotationViewModel(dependencies, editCapability, listId, articleId)),
);
