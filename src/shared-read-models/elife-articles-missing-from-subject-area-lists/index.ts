import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { Doi } from '../../types/doi';

type MissingArticles = { articleIds: ReadonlyArray<Doi> };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleEvent = (readmodel: MissingArticles, event: DomainEvent) => readmodel;

export const elifeArticleMissingFromSubjectAreaLists = (): MissingArticles => pipe(
  [],
  RA.reduce(
    { articleIds: [] },
    handleEvent,
  ),
);
