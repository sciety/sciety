import { Doi } from './doi';
import { EditorialCommunityId } from './editorial-community-id';

export type EndorsementsRepository = {
  endorsingEditorialCommunityIds: (doi: Doi) => Promise<Array<EditorialCommunityId>>,
  endorsedBy: (editorialCommunityId: EditorialCommunityId) => Promise<Array<Doi>>,
};
