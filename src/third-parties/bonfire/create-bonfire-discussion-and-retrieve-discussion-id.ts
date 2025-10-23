import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { generateAuthenticationHeaders } from './generate-authentication-headers';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';

const bonfireDiscussionIdCodec = t.type({
  data: t.strict({
    addMediaByUri: t.strict({
      id: t.string,
    }),
  }),
});

export const createBonfireDiscussionAndRetrieveDiscussionId = (logger: Logger): ExternalQueries['createBonfireDiscussionAndRetrieveDiscussionId'] => (expressionDoi: ExpressionDoi) => pipe(
  generateAuthenticationHeaders(logger),
  TE.chain((headers) => pipe(
    {
      query: `mutation AddMediaByUri { addMediaByUri(input: { uri: "https://doi.org/${expressionDoi}" } toBoundary: "public") { id url label } }`,
    },
    JSON.stringify,
    postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql', headers),
    TE.chainEitherKW(flow(
      decodeAndLogFailures(logger, bonfireDiscussionIdCodec),
      E.mapLeft(() => DE.unavailable),
    )),
    TE.map((decodedResult) => decodedResult.data.addMediaByUri.id),
  )),
);
