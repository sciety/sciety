import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { ViewModel } from './view-model';

type Annotation = {
  author: string,
  content: HtmlFragment,
};

export type ArticleCardWithControlsAndAnnotationViewModel = {
  articleCard: ViewModel,
  hasControls: boolean,
  listId: ListId,
  articleId: Doi,
  annotation: O.Option<Annotation>,
};
