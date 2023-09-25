import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructArticleCardViewModel, Dependencies as ConstructArticleCardViewModelDependencies } from '../article-card/construct-article-card-view-model';
import { ArticleErrorCardViewModel } from '../article-card/render-article-error-card';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { ViewModel } from '../article-card/view-model';
import { Queries } from '../../read-models';
import { constructAnnotation } from './construct-annotation';
import { ArticleCardWithControlsAndAnnotationViewModel } from './article-card-with-controls-and-annotation-view-model';
import { articleIdInputName, listIdInputName } from '../../annotations/create-annotation-form-page';

type Ports = ConstructArticleCardViewModelDependencies & Queries;

const toArticleCardWithControlsAndAnnotationViewModel = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
  articleId: Doi,
) => (articleCard: ViewModel): ArticleCardWithControlsAndAnnotationViewModel => pipe(
  {
    articleCard,
    hasControls: editCapability,
    listId,
    articleId,
    annotation: constructAnnotation(ports)(listId, articleId),
    createAnnotationFormHref: `/annotations/create-annotation-form-avasthi-reading?${articleIdInputName}=${articleId.value}&${listIdInputName}=${listId}`,
  },
);

export const constructArticleCardWithControlsAndAnnotationViewModel = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
) => (
  articleId: Doi,
): TE.TaskEither<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel> => pipe(
  articleId,
  constructArticleCardViewModel(ports),
  TE.map(toArticleCardWithControlsAndAnnotationViewModel(ports, editCapability, listId, articleId)),
);
