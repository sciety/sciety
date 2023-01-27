import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';
import { toListCardViewModel } from './to-list-card-view-model';
import { HtmlFragment } from '../../../types/html-fragment';
import { ContentModel } from '../content-model';

export const lists = (contentModel: ContentModel): TE.TaskEither<never, HtmlFragment> => pipe(
  contentModel.lists,
  RA.reverse,
  RA.map(toListCardViewModel),
  renderListOfListCardsWithFallback,
  TE.right,
);
