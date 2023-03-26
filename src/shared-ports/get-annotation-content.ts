import * as O from 'fp-ts/Option';
import { ListId } from '../types/list-id';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';

export type GetAnnotationContent = (listId: ListId, articleId: Doi) => O.Option<HtmlFragment>;
