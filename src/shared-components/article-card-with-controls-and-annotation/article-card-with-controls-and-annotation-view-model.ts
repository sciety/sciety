import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
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
  hasControls: boolean,
  listId: ListId,
  articleId: Doi,
  annotation: O.Option<Annotation>,
  createAnnotationFormHref: string,
  controls: O.Option<{
    listId: ListId,
    articleId: Doi,
    createAnnotationFormHref: O.Option<string>,
  }>,
};
