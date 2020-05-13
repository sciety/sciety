import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (): EditorialCommunityRepository => {
  const editorialCommunities: Array<EditorialCommunity> = [
    {
      id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      name: 'eLife',
      description: `eLife is a non-profit organisation created by funders and led by researchers. Our mission is to
  accelerate discovery by operating a platform for research communication that encourages and recognises the most
  responsible behaviours in science.`,
    },
    {
      id: 'e3a371f9-576d-48d5-a690-731b9fea26bd',
      name: 'Royal Society of Psychoceramics',
      description: 'Dulce et Decorum Est Desipere in Loco',
    },
  ];

  const result: EditorialCommunityRepository = {
    all: () => editorialCommunities,
    lookup: (id) => editorialCommunities.find((ec) => ec.id === id),
  };
  return result;
};
