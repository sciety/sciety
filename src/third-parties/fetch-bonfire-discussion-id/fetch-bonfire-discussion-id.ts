import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import {
  CanonicalExpressionDoi, eqExpressionDoi, ExpressionDoi, fromValidatedString,
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

const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);

export const fetchBonfireDiscussionId = (logger: Logger): ExternalQueries['fetchBonfireDiscussionId'] => (expressionDoi: CanonicalExpressionDoi) => {
  if (isAppropriateDoi(expressionDoi)(fromValidatedString('10.7554/elife.95814.3'))) {
    return pipe(
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
    );
  }

  return TE.left(DE.unavailable);
};
