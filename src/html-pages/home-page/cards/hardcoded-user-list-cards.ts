import { UserDetails } from '../../../types/user-details';
import { toUserId } from '../../../types/user-id';

type Card = UserDetails & {
  description: string,
};

export const card1: Card = {
  id: toUserId('1384541806231175172'),
  description: 'Articles that are being read by Biophysics Colab.',
  displayName: 'Biophysics Colab',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_bigger.jpg',
  handle: 'BiophysicsColab',
};

export const card2: Card = {
  id: toUserId('1412019815619911685'),
  description: 'See what researchers at Prachee Avasthi’s lab are reading to discover some interesting new work.',
  displayName: 'Prachee Avasthi',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1417079202973638657/VrQKBTkw_bigger.jpg',
  handle: 'AvasthiReading',
};

export const card3: Card = {
  id: toUserId('1122522190791028737'),
  description: 'Articles that are being read by Dr. Maria Eichel-Vogel.',
  displayName: 'Dr. Maria Eichel-Vogel.',
  avatarUrl: 'https://pbs.twimg.com/profile_images/1584205611247583234/aN5oC7iZ_bigger.jpg',
  handle: 'maria_eichel',
};
