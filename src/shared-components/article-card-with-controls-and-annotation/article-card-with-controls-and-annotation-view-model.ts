import * as O from 'fp-ts/Option';
import { ArticleId } from '../../types/article-id';
import { ListId } from '../../types/list-id';
import { ViewModel } from '../article-card/view-model';
import { RawUserInput } from '../../read-models/annotations/handle-event';

export type Annotation = {
  author: string,
  authorAvatarPath: string,
  content: RawUserInput,
};

export type ArticleCardWithControlsAndAnnotationViewModel = {
  articleCard: ViewModel,
  annotation: O.Option<Annotation>,
  controls: O.Option<{
    listId: ListId,
    articleId: ArticleId,
    createAnnotationFormHref: O.Option<string>,
  }>,
};
