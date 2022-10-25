import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { handleEvent, MissingArticles } from './handle-event';

export const elifeArticleMissingFromSubjectAreaLists = (): MissingArticles => pipe(
  [],
  RA.reduce(
    { articleIds: [] },
    handleEvent,
  ),
);
