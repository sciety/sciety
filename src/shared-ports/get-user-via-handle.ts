import * as O from 'fp-ts/Option';
import { UserDetails } from '../types/user-details';
import { UserHandle } from '../types/user-handle';

export type GetUserViaHandle = (handle: UserHandle) => O.Option<UserDetails>;
