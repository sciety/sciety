import * as O from 'fp-ts/Option';
import { toUserId, UserId } from '../../../types/user-id';

// TODO: these should be ListIds
type Card = {
  userId: O.Option<UserId>,
};

export const card1: Card = {
  userId: O.some(toUserId('1384541806231175172')),
};

export const card2: Card = {
  userId: O.some(toUserId('1412019815619911685')),
};

export const card3: Card = {
  userId: O.some(toUserId('1122522190791028737')),
};
