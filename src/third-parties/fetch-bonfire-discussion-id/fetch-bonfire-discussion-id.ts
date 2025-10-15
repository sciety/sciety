import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { CanonicalExpressionDoi } from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';

const bonfireDiscussionIdResponseCodec = t.type({
  data: t.strict({
    post: t.strict({
      id: t.string,
    }),
  }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchBonfireDiscussionId = (logger: Logger): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => pipe(
  {
    query: '{ post(filter: {id: "01K6MQC5NZFYEHXYQ23VCK047B"}) { id postContent { htmlBody } } }',
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, bonfireDiscussionIdResponseCodec),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((decodedResponse) => decodedResponse.data.post.id),
);
