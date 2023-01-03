import * as O from 'fp-ts/Option';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  userId: UserId,
};

export type GetUser = (userId: UserId) => O.Option<UserDetails>;
