import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { generateAuthenticationHeaders } from './generate-authentication-headers';
import { postDataBonfire } from './post-data-bonfire';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

export const createBonfireDiscussionAndRetrieveDiscussionId = (logger: Logger): ExternalQueries['createBonfireDiscussionAndRetrieveDiscussionId'] => (expressionDoi: ExpressionDoi) => pipe(
  {
    query: `mutation AddMediaByUri { addMediaByUri(input: { uri: "https://doi.org/${expressionDoi}" } toBoundary: "public") { id url label } }`,
  },
  JSON.stringify,
  postDataBonfire(logger, 'https://discussions.sciety.org/api/graphql', generateAuthenticationHeaders()),
  TE.mapLeft(() => DE.notFound),
  TE.map(() => ''),
);
