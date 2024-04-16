import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { CrossrefWork, crossrefWorkCodec } from './crossref-work';
import { QueryCrossrefService } from './query-crossref-service';
import { Logger } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { decodeAndLogFailures } from '../../decode-and-log-failures';

const crossrefMultipleWorksResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(crossrefWorkCodec),
  }),
}, 'crossrefMultipleWorksResponseCodec');

const constructUrl = (doi: string) => {
  const workTypes = 'type:posted-content,type:journal-article';
  const relationships = 'relation.type:has-version,relation.type:is-version-of,relation.type:has-preprint,relation.type:is-preprint-of';
  return `https://api.crossref.org/works?filter=relation.object:${doi},${workTypes},${relationships}`;
};

export const fetchWorksThatPointToIndividualWorks = (
  queryCrossrefService: QueryCrossrefService,
  logger: Logger,
) => (
  queue: ReadonlyArray<string>,
): TE.TaskEither<DE.DataError, ReadonlyArray<CrossrefWork>> => pipe(
  queue,
  TE.traverseArray((doi) => pipe(
    constructUrl(doi),
    queryCrossrefService,
    TE.chainEitherKW((response) => pipe(
      response,
      decodeAndLogFailures(logger, crossrefMultipleWorksResponseCodec, { doi, url: constructUrl(doi) }),
      E.mapLeft(() => DE.unavailable),
    )),
  )),
  TE.map((responses) => pipe(
    responses,
    RA.map((response) => response.message.items),
    RA.flatten,
  )),
);
