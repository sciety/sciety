import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { renderArticlesList } from './render-articles-list';
import { HtmlFragment } from '../../../../types/html-fragment';
import { PaginatedCards } from '../view-model';

export const renderCategoryContent = (cards: PaginatedCards['categoryContent']): HtmlFragment => pipe(
  cards,
  RA.rights,
  renderArticlesList,
);
