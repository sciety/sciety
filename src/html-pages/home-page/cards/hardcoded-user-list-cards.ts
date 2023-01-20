import { toUserId, UserId } from '../../../types/user-id';

type Card = {
  userId: UserId,
};

export const card1: Card = {
  userId: toUserId('1384541806231175172'),
};

export const card2: Card = {
  userId: toUserId('1412019815619911685'),
};

export const card3: Card = {
  userId: toUserId('1122522190791028737'),
};
