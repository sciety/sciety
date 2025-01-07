import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { CrossrefWork } from './crossref-work';
import { enqueueInState, State } from './state';
import { eqExpressionDoi, ExpressionDoi } from '../../../types/expression-doi';

type RelationType = 'is-version-of' | 'has-version' | 'is-preprint-of' | 'has-preprint';

const extractRelationsOfType = (work: CrossrefWork, relationType: RelationType) => pipe(
  work.relation[relationType] ?? [],
  RA.map(((relation) => relation.id)),
);

const extractDoisOfRelatedExpressions = (work: CrossrefWork) => [
  ...extractRelationsOfType(work, 'is-version-of'),
  ...extractRelationsOfType(work, 'has-version'),
  ...extractRelationsOfType(work, 'is-preprint-of'),
  ...extractRelationsOfType(work, 'has-preprint'),
];

const hasNotBeenCollected = (state: State) => (doi: ExpressionDoi) => !state.collectedWorks.has(doi);

export const enqueueAllRelatedDoisNotYetCollected = (state: State): State => pipe(
  Array.from(state.collectedWorks.values()),
  RA.chain(extractDoisOfRelatedExpressions),
  RA.uniq(eqExpressionDoi),
  RA.filter(hasNotBeenCollected(state)),
  enqueueInState(state),
);
