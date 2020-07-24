import { Logger } from './logger';
import Doi from '../types/doi';
import EndorsementsRepository from '../types/endorsements-repository';

interface Endorsement {
  article: Doi;
  editorialCommunity: string;
}

export default (
  logger: Logger,
): EndorsementsRepository => {
  const data: Array<Endorsement> = [];

  const repository: EndorsementsRepository = {

    add: async (doi, editorialCommunityId) => {
      data.push({
        article: doi,
        editorialCommunity: editorialCommunityId,
      });
      logger('info', 'Endorsement added', { doi, editorialCommunityId });
    },

    endorsingEditorialCommunityIds: async (doi) => (
      data
        .filter((e) => e.article.value === doi.value)
        .map((e) => e.editorialCommunity)
    ),

    endorsedBy: async (editorialCommunityId) => (
      data
        .filter((e) => e.editorialCommunity === editorialCommunityId)
        .map((e) => e.article)
    ),
  };
  return repository;
};
