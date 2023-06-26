import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  ArticleCardWithControlsAndAnnotationViewModel,
} from '../../../shared-components/article-card';
import {
  Ports as ConstructArticleCardViewModelPorts,
} from '../../../shared-components/article-card/construct-article-card-view-model';
import { PageOfItems } from '../../../shared-components/paginate';
import { ArticleActivity } from '../../../types/article-activity';
import { ArticlesViewModel } from '../view-model';
import { ArticleErrorCardViewModel } from '../../../shared-components/article-card/render-article-error-card';
import { ListId } from '../../../types/list-id';

import { Queries } from '../../../shared-read-models';
import { constructArticleCardWithControlsAndAnnotationViewModel } from '../../../shared-components/article-card/construct-article-card-with-controls-and-annotation-view-model';

export type Ports = ConstructArticleCardViewModelPorts & Queries;

export const toPageOfCards = (
  ports: Ports,
  editCapability: boolean,
  listId: ListId,
) => (
  pageOfArticles: PageOfItems<ArticleActivity>,
): TE.TaskEither<'no-articles-can-be-fetched', ArticlesViewModel> => pipe(
  pageOfArticles.items,
  RA.map((item) => item.articleId),
  T.traverseArray(constructArticleCardWithControlsAndAnnotationViewModel(ports, editCapability, listId)),
  T.map(E.fromPredicate(RA.some(E.isRight), () => 'no-articles-can-be-fetched' as const)),
  TE.chainTaskK(T.traverseArray(
    E.foldW(
      TE.left,
      TE.right<ArticleErrorCardViewModel, ArticleCardWithControlsAndAnnotationViewModel>,
    ),
  )),
);
