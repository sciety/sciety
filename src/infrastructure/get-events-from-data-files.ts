import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toReviewId } from '../types/review-id';

/* eslint-disable no-continue */

export const getEventsFromDataFiles = (
  editorialCommunityIds: ReadonlyArray<string>,
): TE.TaskEither<unknown, Array<DomainEvent>> => {
  const parsedEvents: Array<DomainEvent> = [];

  for (const csvFile of fs.readdirSync('./data/reviews')) {
    const editorialCommunityId = csvFile.replace('.csv', '');
    if (!editorialCommunityIds.includes(editorialCommunityId)) {
      continue;
    }
    const fileContents = fs.readFileSync(`./data/reviews/${csvFile}`);
    parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
      .map(([date, articleDoi, reviewId]: [string, string, string]) => editorialCommunityReviewedArticle(
        new EditorialCommunityId(editorialCommunityId),
        new Doi(articleDoi),
        toReviewId(reviewId),
        new Date(date),
      )));
  }

  return TE.right(parsedEvents);
};
