import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { QueryExternalService } from '../../query-external-service';
import * as DE from '../../../types/data-error';
import { Logger } from '../../../shared-ports';
import { CrossrefWork, crossrefWorkCodec } from './crossref-work';
import { logCodecFailure } from './log-codec-failure';

const crossrefIndividualWorkResponseCodec = t.strict({
  message: crossrefWorkCodec,
});

type QueryCrossrefService = ReturnType<QueryExternalService>;

export const fetchIndividualWork = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (
  doi: string,
): TE.TaskEither<DE.DataError | t.Errors, CrossrefWork> => pipe(
  `https://api.crossref.org/works/${doi}`,
  queryCrossrefService,
  TE.chainEitherKW((response) => pipe(
    response,
    crossrefIndividualWorkResponseCodec.decode,
    E.mapLeft(logCodecFailure(logger, doi, 'fetchIndividualWork')),
    E.map((decodedResponse) => decodedResponse.message),
  )),
);
