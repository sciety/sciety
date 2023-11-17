import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models/index.js';
import { Logger } from '../../shared-ports/index.js';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands.js';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers/add-article-to-list-command-handler.js';

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
      (missingArticle) => addArticleToListCommandHandler(dependencies)({
        listId: missingArticle.listId,
        articleId: missingArticle.articleId,
      }),
    ),
  )();
  dependencies.logger('info', 'ensureEvaluationsAreListed finished');
};
