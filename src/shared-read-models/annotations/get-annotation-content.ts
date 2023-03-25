/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import { ListId } from '../../types/list-id';
import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

type GetAnnotationContent = (listId: ListId, articleId: Doi) => O.Option<HtmlFragment>;

// ts-unused-exports:disable-next-line
export const getAnnotationContent = (readModel: ReadModel): GetAnnotationContent => (listId, articleId) => O.none;
