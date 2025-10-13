import * as TE from 'fp-ts/TaskEither';
import { CanonicalExpressionDoi } from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchBonfireDiscussionId = (): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => TE.right('01K6MQC5NZFYEHXYQ23VCK047B');
