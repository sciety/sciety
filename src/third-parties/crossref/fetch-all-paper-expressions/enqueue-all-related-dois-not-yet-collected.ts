import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/string';
import { State } from './state';
import { CrossrefWork } from './crossref-work';

type RelationType = 'is-version-of' | 'has-version' | 'is-preprint-of' | 'has-preprint';

const extractRelationsOfType = (work: CrossrefWork, relationType: RelationType) => pipe(
  work.relation[relationType] ?? [],
  RA.map((relation) => relation.id.toLowerCase()),
);

const extractDoisOfRelatedExpressions = (work: CrossrefWork) => [
  ...extractRelationsOfType(work, 'is-version-of'),
  ...extractRelationsOfType(work, 'has-version'),
  ...extractRelationsOfType(work, 'is-preprint-of'),
  ...extractRelationsOfType(work, 'has-preprint'),
];

const hasNotBeenCollected = (state: State) => (doi: string) => !state.collectedWorks.has(doi);

export const enqueueAllRelatedDoisNotYetCollected = (state: State): State => pipe(
  Array.from(state.collectedWorks.values()),
  RA.chain(extractDoisOfRelatedExpressions),
  RA.uniq(S.Eq),
  RA.filter(hasNotBeenCollected(state)),
  (dois) => ({
    queue: dois,
    collectedWorks: state.collectedWorks,
  }),
);
