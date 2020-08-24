import { EditorialCommunityEndorsedArticleEvent } from '../types/domain-events';
import EndorsementsRepository from '../types/endorsements-repository';

export default (
  events: ReadonlyArray<EditorialCommunityEndorsedArticleEvent>,
): EndorsementsRepository => ({
  endorsingEditorialCommunityIds: async (doi) => (
    events
      .filter((event) => event.articleId.value === doi.value)
      .map((event) => event.editorialCommunityId)
  ),

  endorsedBy: async (editorialCommunityId) => (
    events
      .filter((event) => event.editorialCommunityId.value === editorialCommunityId.value)
      .map((event) => event.articleId)
  ),
});
