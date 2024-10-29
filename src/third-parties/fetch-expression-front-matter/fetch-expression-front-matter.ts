import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { buildExpressionFrontMatterFromCrossrefWork } from './build-expression-front-matter-from-crossref-work';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const crossrefWorksTransformEndpoint = (expressionDoi: ExpressionDoi): string => `https://api.crossref.org/works/${expressionDoi}/transform`;

const crossrefHeaders = (crossrefApiBearerToken: O.Option<string>) => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.crossref.unixref+xml',
  };
  if (O.isSome(crossrefApiBearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
  }
  return headers;
};

export const fetchExpressionFrontMatter = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
) => (expressionDoi: ExpressionDoi): ReturnType<ExternalQueries['fetchExpressionFrontMatter']> => pipe(
  expressionDoi,
  crossrefWorksTransformEndpoint,
  queryExternalService('warn', crossrefHeaders(crossrefApiBearerToken)),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, t.string, { expressionDoi }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.chainEitherKW((response) => buildExpressionFrontMatterFromCrossrefWork(
    response,
    logger,
    expressionDoi,
  )),
);
