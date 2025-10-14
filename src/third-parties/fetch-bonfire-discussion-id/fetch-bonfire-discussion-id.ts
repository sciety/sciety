/* eslint-disable no-useless-escape */
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import { CanonicalExpressionDoi } from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchBonfireDiscussionId = (logger: Logger): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => pipe(
  {
    query: '{ post(filter: {id: "01K6MQC5NZFYEHXYQ23VCK047B"}) { postContent { htmlBody } activity { replied { threadId } } }}',
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
  TE.map(() => '01K6MQC5NZFYEHXYQ23VCK047B'),
);
