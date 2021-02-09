import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import { Doi } from '../types/doi';
import { DomainEvent, editorialCommunityReviewedArticle } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

const unserializeReviewId = (reviewId: string): ReviewId => {
  const [, protocol, value] = /^(.+?):(.+)$/.exec(reviewId) ?? [];
  switch (protocol) {
    case 'doi':
      return new Doi(value);
    case 'hypothesis':
      return new HypothesisAnnotationId(value);
    default:
      throw new Error(`Unable to unserialize ReviewId: "${reviewId}"`);
  }
};

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
      .map(([date, articleDoi, reviewId]: [string, string, string]): DomainEvent => ({
        type: 'EditorialCommunityReviewedArticle',
        date: new Date(date),
        editorialCommunityId: new EditorialCommunityId(editorialCommunityId),
        articleId: new Doi(articleDoi),
        reviewId: unserializeReviewId(reviewId),
      })));
  }

  const fileContents = fs.readFileSync('./data/editorial-community-joined.csv');
  parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
    .map(([date, editorialCommunityId]: [string, string]): DomainEvent => ({
      type: 'EditorialCommunityJoined',
      date: new Date(date),
      editorialCommunityId: new EditorialCommunityId(editorialCommunityId),
    })));
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
