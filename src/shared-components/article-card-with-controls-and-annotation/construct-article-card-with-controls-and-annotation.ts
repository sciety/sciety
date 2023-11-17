import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructArticleCard } from '../article-card/construct-article-card';
import { ArticleErrorCardViewModel } from '../article-card/render-article-error-card';
import { ListId } from '../../types/list-id';
import { ArticleId } from '../../types/article-id';
import { ViewModel } from '../article-card/view-model';
import { Queries } from '../../read-models';
import { constructAnnotation } from './construct-annotation';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';
import { inputFieldNames } from '../../standards';
import { ConstructArticleCardViewModelDependencies } from '../article-card';

type Dependencies = ConstructArticleCardViewModelDependencies & Queries;

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
): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel> => pipe(
  articleId,
  constructArticleCard(dependencies),
  TE.map(toArticleCardWithControlsAndAnnotationViewModel(dependencies, editCapability, listId, articleId)),
);
