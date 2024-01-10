import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { CrossrefWork, crossrefWorkCodec } from './crossref-work';
import { Logger } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { logCodecFailure } from './log-codec-failure';
import { QueryCrossrefService } from './query-crossref-service';

const crossrefMultipleWorksResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(crossrefWorkCodec),
  }),
});

export const fetchWorksThatPointToIndividualWorks = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (
  queue: ReadonlyArray<string>,
): TE.TaskEither<DE.DataError, ReadonlyArray<CrossrefWork>> => pipe(
  queue,
  TE.traverseArray((doi) => pipe(
    `https://api.crossref.org/works?filter=relation.object:${doi},type:posted-content`,
    queryCrossrefService,
    TE.chainEitherKW((response) => pipe(
      response,
      crossrefMultipleWorksResponseCodec.decode,
      E.mapLeft(logCodecFailure(logger, doi, 'fetchWorksThatPointToIndividualWorks')),
      E.mapLeft(() => DE.unavailable),
    )),
  )),
  TE.map((responses) => pipe(
    responses,
    // eslint-disable-next-line fp-ts/prefer-chain
    RA.map((response) => response.message.items),
    RA.flatten,
  )),
);
