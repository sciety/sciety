import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../logger';
import { Queries } from '../../read-models';
import * as EDOI from '../../types/expression-doi';
import { DependenciesForCommands } from '../../write-side';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as list from '../../write-side/resources/list';

type Dependencies = Queries & DependenciesForCommands & {
  logger: Logger,
};

export const ensureEvaluationsAreListed = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'ensureEvaluationsAreListed starting');
  await pipe(
    dependencies.getUnlistedEvaluatedArticles(),
    RA.head,
    O.match(
      () => TE.right('no-events-created' as const),
      (missingArticle) => executeResourceAction(dependencies)(list.addArticle)({
        listId: missingArticle.listId,
        articleId: EDOI.fromValidatedString(missingArticle.articleId.value),
      }),
    ),
  )();
  dependencies.logger('info', 'ensureEvaluationsAreListed finished');
};
