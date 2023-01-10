import * as O from 'fp-ts/Option';
import { UserDetails } from '../types/user-details';

export type GetUserViaHandle = (handle: string) => O.Option<UserDetails>;
