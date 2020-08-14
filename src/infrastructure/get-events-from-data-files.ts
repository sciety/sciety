import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import Doi from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

export default (): ReadonlyArray<DomainEvent> => {
  const editorialCommunities = [
    '53ed5364-a016-11ea-bb37-0242ac130002',
    '74fd66e9-3b90-4b5a-a4ab-5be83db4c5de',
    '316db7d9-88cc-4c26-b386-f067e0f56334',
    '10360d97-bf52-4aef-b2fa-2f60d319edd7',
    '10360d97-bf52-4aef-b2fa-2f60d319edd8',
    'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
  ];

  const parsedEvents: Array<DomainEvent> = [];

  for (const editorialCommunityId of editorialCommunities) {
    const fileContents = fs.readFileSync(`./data/endorsements/${editorialCommunityId}.csv`);
    parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
      .map(([date, articleDoi]: [string, string]): DomainEvent => ({
        type: 'ArticleEndorsed',
        date: new Date(date),
        actorId: new EditorialCommunityId(editorialCommunityId),
        articleId: new Doi(articleDoi),
      })));
  }

  const unserializeReviewId = (reviewId: string): ReviewId => {
    const [protocol, value] = reviewId.split(':', 2);
    switch (protocol) {
      case 'doi':
        return new Doi(value);
      case 'hypothesis':
        return new HypothesisAnnotationId(value);
      default:
        throw new Error(`Unable to unserialize ReviewId: "${reviewId}"`);
    }
  };
  for (const editorialCommunityId of editorialCommunities) {
    const fileContents = fs.readFileSync(`./data/reviews/${editorialCommunityId}.csv`);
    parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
      .map(([date, articleDoi, reviewId]: [string, string, string]): DomainEvent => ({
        type: 'ArticleReviewed',
        date: new Date(date),
        actorId: new EditorialCommunityId(editorialCommunityId),
        articleId: new Doi(articleDoi),
        reviewId: unserializeReviewId(reviewId),
      })));
  }

  const fileContents = fs.readFileSync('./data/editorial-community-joined.csv');
  parsedEvents.push(...csvParseSync(fileContents, { fromLine: 2 })
    .map(([date, editorialCommunityId]: [string, string]): DomainEvent => ({
      type: 'EditorialCommunityJoined',
      date: new Date(date),
      actorId: new EditorialCommunityId(editorialCommunityId),
    })));

  return parsedEvents;
};
