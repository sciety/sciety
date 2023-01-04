import * as O from 'fp-ts/Option';
import { UserDetails } from '../types/user-details';
import { UserId } from '../types/user-id';

export type GetUser = (userId: UserId) => O.Option<UserDetails>;
