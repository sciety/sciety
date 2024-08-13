import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import * as PH from '../../types/publishing-history';
import { DependenciesForCommands } from '../../write-side';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as paperSnapshot from '../../write-side/resources/paper-snapshot';

type Dependencies = DependenciesForViews & DependenciesForCommands;

export const maintainSnapshotsForEvaluatedExpressions = async (
  dependencies: Dependencies,
): Promise<void> => {
  await pipe(
    dependencies.getExpressionsWithNoAssociatedSnapshot(),
    RA.head,
    TE.fromOption(() => 'no evaluated expressions missing from snapshots'),
    TE.chainW(dependencies.fetchPublishingHistory),
    TE.map(PH.getAllExpressionDois),
    TE.map((expressions) => executeResourceAction(dependencies, paperSnapshot.record)({
      expressionDois: expressions,
    })),
  )();
};
