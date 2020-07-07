import endorsements from '../data/bootstrap-endorsements';
import Doi from '../types/doi';
import EndorsementsRepository from '../types/endorsements-repository';

export default (): EndorsementsRepository => {
  const data: Record<string, Array<string> | undefined> = endorsements;

  const repository: EndorsementsRepository = {

    endorsingEditorialCommunityIds: async (doi) => (
      data[doi.value] ?? []
    ),

    endorsedBy: async (editorialCommunityId) => (
      Object.entries(data)
        .filter((entry) => entry[1]?.includes(editorialCommunityId))
        .map((entry) => new Doi(entry[0]))
    ),
  };
  return repository;
};
