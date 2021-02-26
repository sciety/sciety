import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import { DoiFromString } from './codecs/DoiFromString';
import { Doi } from '../types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toReviewId } from '../types/review-id';

/* eslint-disable no-continue */

const review = t.tuple([
  DateFromISOString,
  DoiFromString,
  t.string, // TODO ReviewId
]);

export const getEventsFromDataFiles = (
  editorialCommunityIds: ReadonlyArray<string>,
): TE.TaskEither<unknown, Array<DomainEvent>> => {
  const parsedEvents = [];

  for (const csvFile of fs.readdirSync('./data/reviews')) {
    const editorialCommunityId = csvFile.replace('.csv', '');
    if (!editorialCommunityIds.includes(editorialCommunityId)) {
      continue;
    }
    const fileContents = fs.readFileSync(`./data/reviews/${csvFile}`);

    parsedEvents.push(pipe(
      csvParseSync(fileContents, { fromLine: 2 }),
      A.map(flow(
        review.decode,
        E.map(([date, articleDoi, reviewId]) => editorialCommunityReviewedArticle(
          new EditorialCommunityId(editorialCommunityId),
          articleDoi,
          toReviewId(reviewId),
          date,
        )),
      )),
    ));
  }

  return pipe(
    parsedEvents,
    A.flatten,
    E.sequenceArray,
    E.map(RA.toArray),
    TE.fromEither,
  );
};
