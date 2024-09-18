import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { byLastEvaluatedAt, byRepresentative } from '../../../../read-models/papers-evaluated-by-group';
import { GroupId } from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ApiData } from '../render-as-json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructViewModel = (dependencies: DependenciesForViews) => (groupId: GroupId): ApiData => pipe(
  groupId,
  dependencies.getPapersEvaluatedByGroup,
  (evaluatedPapers) => Array.from(evaluatedPapers),
  RA.sortBy([byLastEvaluatedAt, byRepresentative]),
);
