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

export const nextState = (state: State) => (dois: State['queue']): State => ({
  queue: dois,
  collectedWorks: state.collectedWorks,
});
