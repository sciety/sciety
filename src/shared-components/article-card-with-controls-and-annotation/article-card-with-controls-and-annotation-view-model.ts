import * as O from 'fp-ts/Option';
import { ArticleId } from '../../types/article-id';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ViewModel } from '../article-card/view-model';

type Annotation = {
  author: string,
  authorAvatarPath: string,
  content: HtmlFragment,
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
