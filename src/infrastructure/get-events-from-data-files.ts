import { Buffer } from 'buffer';
import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { taskify } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { DoiFromString } from './codecs/DoiFromString';
import { ReviewIdFromString } from './codecs/ReviewIdFromString';
import { DomainEvent, editorialCommunityReviewedArticle } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';

/* eslint-disable no-continue */

const reviews = t.readonlyArray(t.tuple([
  DateFromISOString,
  DoiFromString,
  ReviewIdFromString,
]));

export const getEventsFromDataFiles = (
  editorialCommunityIds: ReadonlyArray<string>,
): TE.TaskEither<unknown, Array<DomainEvent>> => pipe(
  editorialCommunityIds,
  RA.map((editorialCommunityId) => pipe(
    `./data/reviews/${editorialCommunityId}.csv`,
    taskify(fs.readFile),
    T.map(E.orElse(() => E.right(Buffer.from('')))), // TODO skip files that don't exist
    T.map(E.chainW((fileContents) => pipe(
      csvParseSync(fileContents, { fromLine: 2 }),
      reviews.decode,
    ))),
    TE.map(RA.map(([date, articleDoi, reviewId]) => editorialCommunityReviewedArticle(
      new EditorialCommunityId(editorialCommunityId),
      articleDoi,
      reviewId,
      date,
    ))),
  )),
  TE.sequenceArray,
  TE.map(RA.flatten),
  TE.map(RA.toArray),
);
