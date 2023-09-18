import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructArticleCardViewModel, Dependencies as ConstructArticleCardViewModelDependencies } from './construct-article-card-view-model';
import { ArticleErrorCardViewModel } from './render-article-error-card';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { ArticleCardWithControlsAndAnnotationViewModel } from './render-article-card-with-controls-and-annotation';
import { ViewModel } from './view-model';
import { Queries } from '../../read-models';
import { constructAnnotation } from './construct-annotation';

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
