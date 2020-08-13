import Doi from '../types/doi';
import { ArticleEndorsedEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';

interface Endorsement {
  article: Doi;
  editorialCommunity: EditorialCommunityId;
}

export default (
  events: ReadonlyArray<ArticleEndorsedEvent>,
): EndorsementsRepository => {
  const data: Array<Endorsement> = events.map((event) => ({
    article: event.articleId,
    editorialCommunity: event.actorId,
  }));

  return {
    endorsingEditorialCommunityIds: async (doi) => (
      data
        .filter((e) => e.article.value === doi.value)
        .map((e) => e.editorialCommunity)
    ),

    endorsedBy: async (editorialCommunityId) => (
      data
        .filter((e) => e.editorialCommunity.value === editorialCommunityId.value)
        .map((e) => e.article)
    ),
  };
};
