import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/string';
import { State } from './state';
import { CrossrefWork } from './crossref-work';

const extractDoisOfRelatedExpressions = (work: CrossrefWork) => [
  ...pipe(
    work.relation['is-version-of'] ?? [],
    RA.map((relation) => relation.id.toLowerCase()),
  ),
  ...pipe(
    work.relation['has-version'] ?? [],
    RA.map((relation) => relation.id.toLowerCase()),
  ),
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