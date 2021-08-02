import { Buffer } from 'buffer';
import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { taskify } from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { DomainEvent, editorialCommunityReviewedArticle } from '../domain-events';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { GroupId } from '../types/group-id';
import { reviewIdCodec } from '../types/review-id';

const reviews = t.readonlyArray(t.tuple([
  DateFromISOString,
  DoiFromString,
  reviewIdCodec,
]));

export const getEventsFromDataFiles = (
  groupIds: RNEA.ReadonlyNonEmptyArray<GroupId>,
): TE.TaskEither<unknown, RNEA.ReadonlyNonEmptyArray<DomainEvent>> => pipe(
  groupIds,
  TE.traverseArray((groupId) => pipe(
    `./data/reviews/${groupId}.csv`,
    taskify(fs.readFile),
    T.map(E.orElse(() => E.right(Buffer.from('')))), // TODO skip files that don't exist
    TE.chainEitherKW(flow(
      (fileContents) => csvParseSync(fileContents, { fromLine: 2 }) as unknown,
      reviews.decode,
    )),
    TE.map(RA.map(([date, articleDoi, reviewId]) => editorialCommunityReviewedArticle(
      groupId,
      articleDoi,
      reviewId,
      date,
    ))),
  )),
  TE.chainEitherKW(flow(
    RA.flatten,
    RNEA.fromReadonlyArray,
    E.fromOption(constant('No events found')),
  )),
);
