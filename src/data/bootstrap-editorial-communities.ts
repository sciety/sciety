import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';

const editorialCommunities: RNEA.ReadonlyNonEmptyArray<Group> = [
  {
    id: new GroupId('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    name: 'PREreview',
    avatarPath: '/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg',
    descriptionPath: 'prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.md',
  },
  {
    id: new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
    name: 'PeerJ',
    avatarPath: '/static/groups/peerj--53ed5364-a016-11ea-bb37-0242ac130002.jpg',
    descriptionPath: 'peerj--53ed5364-a016-11ea-bb37-0242ac130002.md',
  },
  {
    id: new GroupId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    name: 'Review Commons',
    avatarPath: '/static/groups/review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.jpg',
    descriptionPath: 'review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.md',
  },
  {
    id: new GroupId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    name: 'eLife',
    avatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
    descriptionPath: 'elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.md',
  },
  {
    id: new GroupId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    name: 'Peer Community In Zoology',
    avatarPath: '/static/groups/pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.jpg',
    descriptionPath: 'pci-zoology--74fd66e9-3b90-4b5a-a4ab-5be83db4c5de.md',
  },
  {
    id: new GroupId('19b7464a-edbe-42e8-b7cc-04d1eb1f7332'),
    name: 'Peer Community in Evolutionary Biology',
    avatarPath: '/static/groups/pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.jpg',
    descriptionPath: 'pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.md',
  },
  {
    id: new GroupId('32025f28-0506-480e-84a0-b47ef1e92ec5'),
    name: 'Peer Community in Ecology',
    avatarPath: '/static/groups/pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.jpg',
    descriptionPath: 'pci-ecology--32025f28-0506-480e-84a0-b47ef1e92ec5.md',
  },
  {
    id: new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    name: 'Peer Community in Animal Science',
    avatarPath: '/static/groups/pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.png',
    descriptionPath: 'pci-animal-science--4eebcec9-a4bb-44e1-bde3-2ae11e65daaa.md',
  },
  {
    id: new GroupId('b90854bf-795c-42ba-8664-8257b9c68b0c'),
    name: 'Peer Community in Archaeology',
    avatarPath: '/static/groups/pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.jpg',
    descriptionPath: 'pci-archaeology--b90854bf-795c-42ba-8664-8257b9c68b0c.md',
  },
  {
    id: new GroupId('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84'),
    name: 'Peer Community in Paleontology',
    avatarPath: '/static/groups/pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.jpg',
    descriptionPath: 'pci-paleontology--7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84.md',
  },
];

let experimentEditorialCommunities: ReadonlyArray<Group> = [];

if (process.env.EXPERIMENT_ENABLED === 'true') {
  experimentEditorialCommunities = [
    {
      id: new GroupId('f97bd177-5cb6-4296-8573-078318755bf2'),
      name: 'preLights',
      avatarPath: '/static/groups/prelights--f97bd177-5cb6-4296-8573-078318755bf2.jpg',
      descriptionPath: 'prelights--f97bd177-5cb6-4296-8573-078318755bf2.md',
    },
    {
      id: new GroupId('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
      name: 'NCRC',
      avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
      descriptionPath: 'ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.md',
    },
  ];
}

export const bootstrapEditorialCommunities = RNEA.concat(editorialCommunities, experimentEditorialCommunities);
