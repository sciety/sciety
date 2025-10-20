import * as TE from 'fp-ts/TaskEither';
import { Logger } from '../../logger';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createBonfireDiscussionAndRetrieveDiscussionId = (logger: Logger): ExternalQueries['createBonfireDiscussionAndRetrieveDiscussionId'] => (expressionDoi: ExpressionDoi) => TE.right('');
