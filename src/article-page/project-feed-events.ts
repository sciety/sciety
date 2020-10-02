import { GetFeedEvents } from './get-feed-reviews';
import EditorialCommunityId from '../types/editorial-community-id';
import HypothesisAnnotationId from '../types/hypothesis-annotation-id';

export default (): GetFeedEvents => (
  async (doi) => {
    if (doi.value === '10.1101/646810') {
      return [
        {
          reviewId: new HypothesisAnnotationId('GFEW8JXMEeqJQcuc-6NFhQ'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
        {
          reviewId: new HypothesisAnnotationId('F4-xmpXMEeqf3_-2H0r-9Q'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
        {
          reviewId: new HypothesisAnnotationId('F7e5QpXMEeqnbCM3UE6XLQ'),
          editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
          occurredAt: new Date('2020-05-14'),
        },
      ];
    }
    return [];
  }
);
