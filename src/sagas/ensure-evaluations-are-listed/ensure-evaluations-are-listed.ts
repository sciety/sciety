import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as EDOI from '../../types/expression-doi';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as list from '../../write-side/resources/list';
import { DependenciesForSagas } from '../dependencies-for-sagas';

type Dependencies = DependenciesForSagas;

export const ensureEvaluationsAreListed = async (dependencies: Dependencies): Promise<void> => {
  dependencies.logger('debug', 'ensureEvaluationsAreListed starting');
  await pipe(
    dependencies.getUnlistedEvaluatedArticles(),
    RA.head,
    O.match(
      () => TE.right('no-events-created' as const),
      (missingArticle) => executeResourceAction(dependencies, list.addArticle)({
        listId: missingArticle.listId,
        expressionDoi: EDOI.fromValidatedString(missingArticle.articleId.value),
      }),
    ),
  )();
  dependencies.logger('debug', 'ensureEvaluationsAreListed finished');
};
