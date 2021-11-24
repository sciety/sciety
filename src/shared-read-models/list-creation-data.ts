/* eslint-disable @typescript-eslint/no-unused-vars */
import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';
import * as GID from '../types/group-id';

// type ListCreatedEvent = {
//   listId: string,
//   name: string,
//   description: string,
//   ownerId: GID.GroupId,
//   occurredAt: Date,
// };

type ListId = string;

type List = {
  listId: ListId,
  name: string,
  description: string,
  ownerId: GID.GroupId,
  members: ReadonlyArray<Doi>,
  lastUpdated: Date,
};

const listCreationData: Record<ListId, List> = {
  'ee7e738a-a1f1-465b-807c-132d273ca952': {
    listId: 'ee7e738a-a1f1-465b-807c-132d273ca952',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    description: 'Articles that have been evaluated by Biophysics Colab',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'dc83aa3b-1691-4356-b697-4257d31a27dc': {
    listId: 'dc83aa3b-1691-4356-b697-4257d31a27dc',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('50401e46-b764-47b7-8557-6bb35444b7c8'),
    description: 'Articles that have been evaluated by ASAPbio crowd review',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '4654fd6e-cb00-458f-967b-348b41804927': {
    listId: '4654fd6e-cb00-458f-967b-348b41804927',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a'),
    description: 'Articles that have been evaluated by NCRC',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '49e589f1-531d-4447-92b6-e60b6d1c705e': {
    listId: '49e589f1-531d-4447-92b6-e60b6d1c705e',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94'),
    description: 'Articles that have been evaluated by Rapid Reviews COVID-19',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'f1561c0f-d247-4e03-934d-52ad9e0aed2f': {
    listId: 'f1561c0f-d247-4e03-934d-52ad9e0aed2f',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    description: 'Articles that have been evaluated by eLife',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'e9606e0e-8fdb-4336-a24a-cc6547d7d950': {
    listId: 'e9606e0e-8fdb-4336-a24a-cc6547d7d950',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65'),
    description: 'Articles that have been evaluated by ScreenIT',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'f4b96b8b-db49-4b41-9c5b-28d66a83cd70': {
    listId: 'f4b96b8b-db49-4b41-9c5b-28d66a83cd70',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('f97bd177-5cb6-4296-8573-078318755bf2'),
    description: 'Articles that have been evaluated by preLights',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '5c2e4b99-f5f0-4145-8c87-cadd7a41a1b1': {
    listId: '5c2e4b99-f5f0-4145-8c87-cadd7a41a1b1',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('10360d97-bf52-4aef-b2fa-2f60d319edd7'),
    description: 'Articles that have been evaluated by PREreview',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'f981342c-bf38-4dc8-9569-acda5878c07b': {
    listId: 'f981342c-bf38-4dc8-9569-acda5878c07b',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('53ed5364-a016-11ea-bb37-0242ac130002'),
    description: 'Articles that have been evaluated by PeerJ',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'f3dbc188-e891-4586-b267-c99cf3b3808e': {
    listId: 'f3dbc188-e891-4586-b267-c99cf3b3808e',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
    description: 'Articles that have been evaluated by Review Commons',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'a4d57b30-b41c-4c9d-81f0-dccd4cd1d099': {
    listId: 'a4d57b30-b41c-4c9d-81f0-dccd4cd1d099',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    description: 'Articles that have been evaluated by Peer Community In Zoology',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '3d69f9e5-6fd2-4266-9cf8-c069bca79617': {
    listId: '3d69f9e5-6fd2-4266-9cf8-c069bca79617',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('19b7464a-edbe-42e8-b7cc-04d1eb1f7332'),
    description: 'Articles that have been evaluated by Peer Community in Evolutionary Biology',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '65f661e6-73f9-43e9-9ae6-a84635afb79a': {
    listId: '65f661e6-73f9-43e9-9ae6-a84635afb79a',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('32025f28-0506-480e-84a0-b47ef1e92ec5'),
    description: 'Articles that have been evaluated by Peer Community in Ecology',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'e764d90c-ffea-4b0e-a63e-d2b5236aa1ed': {
    listId: 'e764d90c-ffea-4b0e-a63e-d2b5236aa1ed',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    description: 'Articles that have been evaluated by Peer Community in Animal Science',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  '24a60cf9-5f45-43f2-beaf-04139e6f0a0e': {
    listId: '24a60cf9-5f45-43f2-beaf-04139e6f0a0e',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('b90854bf-795c-42ba-8664-8257b9c68b0c'),
    description: 'Articles that have been evaluated by Peer Community in Archaeology',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'dd9d166f-6d25-432c-a60f-6df33ca86897': {
    listId: 'dd9d166f-6d25-432c-a60f-6df33ca86897',
    name: 'Evaluated articles',
    ownerId: GID.fromValidatedString('7a9e97d1-c1fe-4ac2-9572-4ecfe28f9f84'),
    description: 'Articles that have been evaluated by Peer Community in Paleontology',
    members: [],
    lastUpdated: new Date(), // not sure what value to put here
  },
  'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': {
    listId: 'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
    name: 'High interest articles',
    description: 'Articles that have been identified as high interest by NCRC editors.',
    ownerId: GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg'),
    members: [],
    lastUpdated: new Date('2021-11-24'),
  },
  '5ac3a439-e5c6-4b15-b109-92928a740812': {
    listId: '5ac3a439-e5c6-4b15-b109-92928a740812',
    name: 'Endorsed articles',
    description: 'Articles that have been endorsed by Biophysics Colab.',
    ownerId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2.png'),
    members: [],
    lastUpdated: new Date('2021-11-22T15:09:00Z'),
  },
};

type AllListsReadModel = Record<ListId, List>;

// Queries:

// getAllEvents,
// T.map(allListsReadModel),
// T.map(selectAllListsOwnedBy(groupId)),
type SelectAllListsOwnedBy = (groupId: GID.GroupId) => (readModel: AllListsReadModel) => ReadonlyArray<List>;

// getAllEvents,
// T.map(allListsReadModel),
// T.map(selectList(listId)),
type SelectList = (listId: ListId) => (readModel: AllListsReadModel) => O.Option<List>;

type ListPageHeaderViewModel = {
  name: string,
  description: string,
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
  articleCount: number,
  lastUpdated: Date, // possibly coupled to user list cards
};

type ListCardViewModel = {
  title: string,
  description: string,
  href: string,
  articleCount: number,
  articleCountLabel: string, // possibly coupled to user list cards
  lastUpdated: Date, // possibly coupled to user list cards
};
