import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import {
  CanonicalExpressionDoi, ExpressionDoi, fromValidatedString,
} from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';

const bonfireDiscussionIds = new Map<ExpressionDoi, string>(Object.entries({
  '10.7554/elife.95814.3': '01K6MQC5NZFYEHXYQ23VCK047B',
}).map(([doi, id]) => [fromValidatedString(doi), id]));

const bonfireDiscussionIdResponseCodec = t.type({
  data: t.strict({
    post: t.strict({
      id: t.string,
    }),
  }),
});

export const fetchBonfireDiscussionId = (logger: Logger): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => pipe(
  bonfireDiscussionIds.get(expressionDoi),
  O.fromNullable,
  (foo) => foo,
  O.match(
    () => TE.left(DE.unavailable),
    (bonfireDiscussionId) => pipe(
      {
        query: `{ post(filter: {id: "${bonfireDiscussionId}"}) { id postContent { htmlBody } } }`,
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
