import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../shared-read-models';
import { Logger } from '../../shared-ports';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers/add-article-to-list-command-handler';
import { Doi } from '../../types/doi';

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
      (cmd) => addArticleToListCommandHandler(dependencies)({
        listId: cmd.listId,
        articleId: new Doi(cmd.articleId),
      }),
    ),
  )();
  dependencies.logger('info', 'ensureEvaluationsAreListed finished');
};
