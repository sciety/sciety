import { toUserId, UserId } from '../../../types/user-id';

type Card = {
  userId: UserId,
  description: string,
};

export const card1: Card = {
  userId: toUserId('1384541806231175172'),
  description: 'Articles that are being read by Biophysics Colab.',
};

export const card2: Card = {
  userId: toUserId('1412019815619911685'),
  description: 'See what researchers at Prachee Avasthi’s lab are reading to discover some interesting new work.',
};

export const card3: Card = {
  userId: toUserId('1122522190791028737'),
  description: 'Articles that are being read by Dr. Maria Eichel-Vogel.',
};
