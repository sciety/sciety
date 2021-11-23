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
  'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': {
    listId: 'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
    name: 'High interest articles',
    description: 'Articles that have been identified as high interest by NCRC editors.',
    ownerId: GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg'),
    members: [],
    lastUpdated: new Date('2021-11-18T11:33:00Z'),
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
// T.map(allListsOwnedBy(groupId)),
type AllListsOwnedBy = (groupId: GID.GroupId) => (readModel: AllListsReadModel) => ReadonlyArray<List>;

// getAllEvents,
// T.map(allListsReadModel),
// T.map(getList(listId)),
type GetList = (listId: ListId) => (readModel: AllListsReadModel) => O.Option<List>;

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
