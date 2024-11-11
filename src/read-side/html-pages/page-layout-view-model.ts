import * as O from 'fp-ts/Option';
import { UserDetails } from '../../types/user-details';

export type PageLayoutViewModel = { userDetails: O.Option<UserDetails> };
