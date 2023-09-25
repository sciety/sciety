import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructArticleCardViewModel, Dependencies as ConstructArticleCardViewModelDependencies } from '../article-card/construct-article-card-view-model';
import { ArticleErrorCardViewModel } from '../article-card/render-article-error-card';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { ViewModel } from '../article-card/view-model';
import { Queries } from '../../read-models';
import { constructAnnotation } from './construct-annotation';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';
import { articleIdInputName, listIdInputName } from '../../html-pages/create-annotation-form-page/create-annotation-form-page';

type Dependencies = ConstructArticleCardViewModelDependencies & Queries;

const toArticleCardWithControlsAndAnnotationViewModel = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
  articleId: Doi,
) => (articleCard: ViewModel): ArticleCardWithControlsAndAnnotationViewModel => pipe(
  constructAnnotation(dependencies)(listId, articleId),
  (annotation) => ({
    articleCard,
    hasControls: editCapability,
    listId,
    articleId,
    annotation,
    createAnnotationFormHref: `/annotations/create-annotation-form?${articleIdInputName}=${articleId.value}&${listIdInputName}=${listId}`,
    controls: editCapability ? O.some({
      listId,
      articleId,
      createAnnotationFormHref: O.isNone(annotation)
        ? O.some(`/annotations/create-annotation-form?${articleIdInputName}=${articleId.value}&${listIdInputName}=${listId}`)
        : O.none,
    }) : O.none,
  }),
);

export const constructViewModel = (
  dependencies: Dependencies,
  editCapability: boolean,
  listId: ListId,
) => (
  articleId: Doi,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel> => pipe(
  articleId,
  constructArticleCardViewModel(dependencies),
  TE.map(toArticleCardWithControlsAndAnnotationViewModel(dependencies, editCapability, listId, articleId)),
);
