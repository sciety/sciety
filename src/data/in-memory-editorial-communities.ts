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
      id: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
      name: 'PREreview Community',
      description: `PREreview's mission is to bring more diversity to scholarly peer review by supporting and 
      empowering community of researchers, particularly those at early stages of their career (ECRs) to review 
      preprints.`,
    },
    {
      id: '53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
      description: `This is a placeholder text for the PeerJ editorial community.`,
    },
  ];

  const result: EditorialCommunityRepository = {
    all: () => editorialCommunities,
    lookup: (id) => {
      const candidate = editorialCommunities.find((ec) => ec.id === id);
      return candidate ?? {
        id,
        name: 'Unknown',
        description: 'Unknown',
      };
    },
  };
  return result;
};
