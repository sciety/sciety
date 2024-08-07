import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { listAcmiArticle } from './list-acmi-article';
import { Logger } from '../../logger';
import { Queries } from '../../read-models';
import { MissingArticle } from '../../read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import * as EDOI from '../../types/expression-doi';
import { DependenciesForCommands } from '../../write-side';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as list from '../../write-side/resources/list';

type Dependencies = Queries & DependenciesForCommands & {
  logger: Logger,
};

const listPapers = (dependencies: Dependencies) => (
  missingArticle: MissingArticle,
) => {
  if (missingArticle.listId === '53fd6f10-af16-4bf4-8473-707ca8daee97') {
    return listAcmiArticle();
  }
  return executeResourceAction(dependencies, list.addArticle)({
    listId: missingArticle.listId,
    expressionDoi: EDOI.fromValidatedString(missingArticle.articleId.value),
  });
};

export const ensureEvaluationsAreListed = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('info', 'ensureEvaluationsAreListed starting');
  await pipe(
    dependencies.getUnlistedEvaluatedArticles(),
    RA.head,
    O.match(
      () => TE.right('no-events-created' as const),
      listPapers(dependencies),
    ),
  )();
  dependencies.logger('info', 'ensureEvaluationsAreListed finished');
};
