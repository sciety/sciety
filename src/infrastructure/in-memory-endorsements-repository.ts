import endorsements from '../data/bootstrap-endorsements';
import Doi from '../types/doi';
import EndorsementsRepository from '../types/endorsements-repository';

interface Endorsement {
  article: string;
  editorialCommunity: string;
}

export default (): EndorsementsRepository => {
  const data: Array<Endorsement> = endorsements;

  const repository: EndorsementsRepository = {

    endorsingEditorialCommunityIds: async (doi) => (
      data
        .filter((e) => e.article === doi.value)
        .map((e) => e.editorialCommunity)
    ),

    endorsedBy: async (editorialCommunityId) => (
      data
        .filter((e) => e.editorialCommunity === editorialCommunityId)
        .map((e) => new Doi(e.article))
    ),
  };
  return repository;
};
