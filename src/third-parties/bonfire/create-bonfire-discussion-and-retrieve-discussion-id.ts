import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createBonfireDiscussionAndRetrieveDiscussionId = (logger: Logger): ExternalQueries['createBonfireDiscussionAndRetrieveDiscussionId'] => (expressionDoi: ExpressionDoi) => pipe(
  {
    query: '{}',
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
  TE.mapLeft(() => DE.notFound),
  TE.map(() => ''),
);
