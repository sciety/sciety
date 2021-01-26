import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

/* eslint-disable no-continue */

export default (editorialCommunityIds: ReadonlyArray<string>): Array<DomainEvent> => {
  const parsedEvents: Array<DomainEvent> = [];

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

  return parsedEvents;
};
