import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { byLastEvaluatedAt, byRepresentative } from '../../../../read-models/papers-evaluated-by-group';
import { GroupId } from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { ApiData } from '../render-as-json';

export const constructViewModel = (dependencies: DependenciesForViews) => (groupId: GroupId): ApiData => pipe(
  groupId,
  dependencies.getPapersEvaluatedByGroup,
  (papers) => ({
    total: papers.size,
    items: pipe(
      Array.from(papers),
      RA.sortBy([byLastEvaluatedAt, byRepresentative]),
    ),
  }),
);
