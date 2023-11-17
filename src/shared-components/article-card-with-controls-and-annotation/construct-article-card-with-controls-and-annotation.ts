import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructArticleCard, Dependencies as ConstructArticleCardViewModelDependencies } from '../article-card/construct-article-card.js';
import { ArticleErrorCardViewModel } from '../article-card/render-article-error-card.js';
import { ListId } from '../../types/list-id.js';
import { ArticleId } from '../../types/article-id.js';
import { ViewModel } from '../article-card/view-model.js';
import { Queries } from '../../read-models/index.js';
import { constructAnnotation } from './construct-annotation.js';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model.js';
import { inputFieldNames } from '../../standards/index.js';

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
