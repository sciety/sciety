import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { CrossrefWork, crossrefWorkCodec } from './crossref-work';
import { QueryCrossrefService } from './query-crossref-service';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { decodeAndLogFailures } from '../../decode-and-log-failures';

const crossrefIndividualWorkResponseCodec = t.strict({
  message: crossrefWorkCodec,
}, 'crossrefIndividualWorksResponseCodec');

export const fetchIndividualWork = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (
  doi: string,
): TE.TaskEither<DE.DataError, CrossrefWork> => pipe(
  `https://api.crossref.org/works/${doi}`,
  queryCrossrefService,
  TE.chainEitherKW((response) => pipe(
    response,
    decodeAndLogFailures(logger, crossrefIndividualWorkResponseCodec, { doi }),
    E.mapLeft(() => DE.unavailable),
    E.map((decodedResponse) => decodedResponse.message),
  )),
);
