import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import { Doi } from '../types/doi';
import { DomainEvent, editorialCommunityJoined, editorialCommunityReviewedArticle } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { toReviewId } from '../types/review-id';

/* eslint-disable no-continue */

export const getEventsFromDataFiles = (editorialCommunityIds: ReadonlyArray<string>): Array<DomainEvent> => {
  const parsedEvents: Array<DomainEvent> = [];

  for (const csvFile of fs.readdirSync('./data/reviews')) {
    const editorialCommunityId = csvFile.replace('.csv', '');
    if (!editorialCommunityIds.includes(editorialCommunityId)) {
      continue;
    }
    const fileContents = fs.readFileSync(`./data/reviews/${csvFile}`);
    parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
      .map(([date, articleDoi, reviewId]: [string, string, string]): DomainEvent => editorialCommunityReviewedArticle(
        new EditorialCommunityId(editorialCommunityId),
        new Doi(articleDoi),
        toReviewId(reviewId),
        new Date(date),
      )));
  }

  const fileContents = fs.readFileSync('./data/editorial-community-joined.csv');
  parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
    .map(([date, editorialCommunityId]: [string, string]): DomainEvent => editorialCommunityJoined(
      new EditorialCommunityId(editorialCommunityId),
      new Date(date),
    )));
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    parsedEvents.push(editorialCommunityReviewedArticle(
      new EditorialCommunityId('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
      new Doi('10.1101/2021.01.29.21250653'),
      new Doi('10.1101/hardcoded-fake-ncrc-review-id'),
      new Date('2021-02-04'),
    ));
  }
  return parsedEvents;
};
