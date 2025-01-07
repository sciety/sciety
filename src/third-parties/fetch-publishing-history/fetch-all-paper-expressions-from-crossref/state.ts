import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from './crossref-work';
import { ExpressionDoi } from '../../../types/expression-doi';

export type State = {
  queue: ReadonlyArray<ExpressionDoi>,
  collectedWorks: Map<ExpressionDoi, CrossrefWork>,
};

export const initialState = (doi: ExpressionDoi): State => ({
  queue: [doi],
  collectedWorks: new Map(),
});

const update = (collectedWorks: State['collectedWorks'], newlyFetchedWork: CrossrefWork) => {
  collectedWorks.set(newlyFetchedWork.DOI, newlyFetchedWork);
  return collectedWorks;
};

export const collectWorksIntoStateAndEmptyQueue = (
  state: State,
) => (
  crossrefWorks: ReadonlyArray<CrossrefWork>,
): State => pipe(
  crossrefWorks,
  RA.reduce(state.collectedWorks, update),
  (collectedWorks) => ({
    queue: [],
    collectedWorks,
  }),
);

export const enqueueInState = (state: State) => (dois: State['queue']): State => ({
  queue: dois,
  collectedWorks: state.collectedWorks,
});
