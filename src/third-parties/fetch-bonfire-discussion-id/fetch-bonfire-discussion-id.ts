import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import {
  CanonicalExpressionDoi, fromValidatedString, isAppropriateDoi,
} from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';

const bonfireDiscussionIdResponseCodec = t.type({
  data: t.strict({
    post: t.strict({
      id: t.string,
    }),
  }),
});

export const fetchBonfireDiscussionId = (logger: Logger): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => pipe(
  expressionDoi,
  isAppropriateDoi(fromValidatedString('10.7554/elife.95814.3')),
  B.fold(
    () => TE.left(DE.unavailable),
    () => pipe(
      {
        query: '{ post(filter: {id: "01K6MQC5NZFYEHXYQ23VCK047B"}) { id postContent { htmlBody } } }',
      },
      JSON.stringify,
      postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql'),
      TE.chainEitherKW(flow(
        decodeAndLogFailures(logger, bonfireDiscussionIdResponseCodec, { expressionDoi }),
        E.mapLeft(() => DE.unavailable),
      )),
      TE.map((decodedResponse) => decodedResponse.data.post.id),
    ),
  ),
);
