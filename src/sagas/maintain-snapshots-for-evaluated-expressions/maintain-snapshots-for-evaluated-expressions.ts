import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 as uuidV4 } from 'uuid';
import { DependenciesForViews } from '../../read-side/dependencies-for-views';
import * as PH from '../../types/publishing-history';
import { DependenciesForCommands } from '../../write-side';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as paperSnapshot from '../../write-side/resources/paper-snapshot';

type Dependencies = DependenciesForViews & DependenciesForCommands;

export const maintainSnapshotsForEvaluatedExpressions = async (
  dependencies: Dependencies,
): Promise<void> => {
  const iterationId = uuidV4();
  dependencies.logger('debug', 'maintainSnapshotsForEvaluatedExpressions starting', { iterationId });
  await pipe(
    dependencies.getExpressionsWithNoAssociatedSnapshot(),
    RA.head,
    TE.fromOption(() => 'no evaluated expressions missing from snapshots'),
    TE.chainW((expressionDoi) => pipe(
      expressionDoi,
      dependencies.fetchPublishingHistory,
      TE.mapLeft((error) => {
        dependencies.logger('warn', 'maintainSnapshotsForEvaluatedExpressions fetchPublishingHistory fail', { error, expressionDoi, iterationId });
        return error;
      }),
    )),
    TE.map(PH.getAllExpressionDois),
    TE.chainW((expressions) => executeResourceAction(dependencies, paperSnapshot.record)({
      expressionDois: expressions,
    })),
  )();
  dependencies.logger('debug', 'maintainSnapshotsForEvaluatedExpressions finished', { iterationId });
};
