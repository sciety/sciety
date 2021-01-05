import { URL } from 'url';
import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityId from '../types/editorial-community-id';

const editorialCommunities: Array<EditorialCommunity> = [
  {
    id: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    name: 'PREreview',
    avatar: new URL('https://pbs.twimg.com/profile_images/1296877363712495616/p08CozPa_200x200.jpg'),
    descriptionPath: 'prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.md',
  },
  {
    id: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    name: 'PeerJ',
    avatar: new URL('https://pbs.twimg.com/profile_images/1310539472401043458/gN8sl9Nd_200x200.jpg'),
    descriptionPath: 'peerj--53ed5364-a016-11ea-bb37-0242ac130002.md',
  },
  {
    id: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    name: 'Review Commons',
    avatar: new URL('https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg'),
    descriptionPath: 'review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.md',
  },
  {
    id: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    name: 'eLife',
    avatar: new URL('https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png'),
    descriptionPath: 'elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.md',
  },
  {
    id: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    name: 'Peer Community In Zoology',
    avatar: new URL('https://pbs.twimg.com/profile_images/1278236903549145089/qqgLuJu__400x400.jpg'),
    descriptionPath: 'pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.md',
  },
  {
    id: new EditorialCommunityId('19b7464a-edbe-42e8-b7cc-04d1eb1f7332'),
    name: 'Peer Community in Evolutionary Biology',
    avatar: new URL('https://pbs.twimg.com/profile_images/794877742013628416/MtBW-h3D_200x200.jpg'),
    descriptionPath: 'pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.md',
  },
  {
    id: new EditorialCommunityId('32025f28-0506-480e-84a0-b47ef1e92ec5'),
    name: 'Peer Community in Ecology',
    avatar: new URL('https://pbs.twimg.com/profile_images/940632045579046917/zk4Wncwa_200x200.jpg'),
    descriptionPath: 'pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.md',
  },
  {
    id: new EditorialCommunityId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    name: 'Peer Community in Animal Science',
    avatar: new URL('https://pbs.twimg.com/profile_images/1111642171256508416/5Un6e8tl_200x200.png'),
    descriptionPath: 'pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.md',
  },
  {
    id: new EditorialCommunityId('b90854bf-795c-42ba-8664-8257b9c68b0c'),
    name: 'Peer Community in Archaeology',
    avatar: new URL('https://pbs.twimg.com/profile_images/1232948279417196545/bVWCl3Vh_200x200.jpg'),
    descriptionPath: 'pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.md',
  },
  {
    id: new EditorialCommunityId('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84'),
    name: 'Peer Community in Paleontology',
    avatar: new URL('https://pbs.twimg.com/profile_images/923462041398063104/znm9OQNM_200x200.jpg'),
    descriptionPath: 'pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.md',
  },
  {
    id: new EditorialCommunityId('f97bd177-5cb6-4296-8573-078318755bf2'),
    name: 'preLights',
    avatar: new URL('https://pbs.twimg.com/profile_images/956876220599296002/zo2tD3p5_200x200.jpg'),
    descriptionPath: 'prelights--f97bd177-5cb6-4296-8573-078318755bf2.md',
  },
];

export default editorialCommunities;
