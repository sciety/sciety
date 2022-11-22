import * as LID from '../../types/list-id';
import { toUserId } from '../../types/user-id';

export const card1 = {
  userId: toUserId('1384541806231175172'),
  listId: LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
  description: 'Articles that are being read by Biophysics Colab.',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_bigger.jpg',
  handle: 'BiophysicsColab',
};

export const card2 = {
  userId: toUserId('1412019815619911685'),
  listId: LID.fromValidatedString('dcc7c864-6630-40e7-8eeb-9fb6f012e92b'),
  description: 'See what researchers at Prachee Avasthi’s lab are reading to discover some interesting new work.',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1417079202973638657/VrQKBTkw_bigger.jpg',
  handle: 'AvasthiReading',
};

export const card3 = {
  userId: toUserId('1122522190791028737'),
  listId: LID.fromValidatedString('bea18573-30a9-43e7-b2e5-fb08d7ba2419'),
  description: 'Articles that are being read by Dr. Maria Eichel-Vogel.',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1584205611247583234/aN5oC7iZ_bigger.jpg',
  handle: 'maria_eichel',
};
